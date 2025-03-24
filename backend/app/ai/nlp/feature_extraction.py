"""
Linguistic feature extraction for detecting cognitive decline markers.

This module implements the extraction of linguistic features that may indicate 
early signs of cognitive decline, including lexical diversity, syntactic complexity,
hesitation patterns, and repetition detection.
"""

import logging
import statistics
import spacy
import numpy as np
from typing import Dict, Any, List, Optional, Set, Tuple
from collections import Counter

from app.ai.nlp.preprocessing import nlp, preprocess_text, tokenize_text, get_sentence_dependency_trees

# Initialize logger
logger = logging.getLogger(__name__)

def calculate_lexical_diversity(doc) -> Dict[str, float]:
    """
    Calculate various lexical diversity metrics.
    
    Args:
        doc: spaCy document
        
    Returns:
        Dictionary of lexical diversity metrics
    """
    # Filter for content tokens only
    content_tokens = [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]
    content_lemmas = [token.lemma_.lower() for token in doc if not token.is_stop and not token.is_punct]
    
    # Get total token counts
    total_tokens = len(content_tokens)
    
    if total_tokens == 0:
        logger.warning("No content tokens found for lexical diversity calculation")
        return {
            "type_token_ratio": 0.0,
            "hapax_legomena_ratio": 0.0,
            "unique_lemma_ratio": 0.0
        }
    
    # Calculate type-token ratio (TTR)
    unique_tokens = set(content_tokens)
    ttr = len(unique_tokens) / total_tokens
    
    # Calculate hapax legomena ratio (words that appear only once)
    token_counts = Counter(content_tokens)
    hapax_legomena = [word for word, count in token_counts.items() if count == 1]
    hapax_ratio = len(hapax_legomena) / total_tokens
    
    # Calculate unique lemma ratio
    unique_lemmas = set(content_lemmas)
    lemma_ratio = len(unique_lemmas) / total_tokens
    
    return {
        "type_token_ratio": ttr,
        "hapax_legomena_ratio": hapax_ratio,
        "unique_lemma_ratio": lemma_ratio
    }

def calculate_syntactic_complexity(doc) -> Dict[str, float]:
    """
    Calculate syntactic complexity metrics.
    
    Args:
        doc: spaCy document
        
    Returns:
        Dictionary of syntactic complexity metrics
    """
    # Initialize metrics
    sentence_lengths = []
    tree_depths = []
    dependent_counts = []
    clause_counts = []
    
    for sent in doc.sents:
        # Sentence length in tokens
        sent_length = len(sent)
        sentence_lengths.append(sent_length)
        
        # Measure parse tree depth
        tree_depth = get_parse_tree_depth(sent.root)
        tree_depths.append(tree_depth)
        
        # Count dependents per word
        for token in sent:
            dependent_counts.append(len(list(token.children)))
        
        # Count clauses (tokens with these dependency labels are typically clause roots)
        clause_markers = ["ROOT", "ccomp", "xcomp", "advcl", "acl"]
        clauses = sum(1 for token in sent if token.dep_ in clause_markers)
        clause_counts.append(clauses)
    
    # Return empty values if no sentences were found
    if not sentence_lengths:
        logger.warning("No sentences found for syntactic complexity calculation")
        return {
            "mean_sentence_length": 0.0,
            "max_tree_depth": 0.0,
            "mean_dependents_per_word": 0.0,
            "clauses_per_sentence": 0.0,
            "complex_sentence_ratio": 0.0
        }
    
    # Calculate average values
    mean_sentence_length = statistics.mean(sentence_lengths) if sentence_lengths else 0
    max_tree_depth = max(tree_depths) if tree_depths else 0
    mean_tree_depth = statistics.mean(tree_depths) if tree_depths else 0
    mean_dependents = statistics.mean(dependent_counts) if dependent_counts else 0
    
    # Calculate clauses per sentence
    clauses_per_sentence = statistics.mean(clause_counts) if clause_counts else 0
    
    # Calculate ratio of complex sentences (sentences with more than one clause)
    complex_sentences = sum(1 for count in clause_counts if count > 1)
    complex_sentence_ratio = complex_sentences / len(sentence_lengths) if sentence_lengths else 0
    
    return {
        "mean_sentence_length": mean_sentence_length,
        "max_tree_depth": max_tree_depth,
        "mean_tree_depth": mean_tree_depth,
        "mean_dependents_per_word": mean_dependents,
        "clauses_per_sentence": clauses_per_sentence,
        "complex_sentence_ratio": complex_sentence_ratio
    }

def get_parse_tree_depth(root, current_depth=0) -> int:
    """
    Recursively compute the depth of a parse tree from the given root.
    
    Args:
        root: Root token of the parse tree
        current_depth: Current depth in the recursion
        
    Returns:
        Maximum depth of the parse tree
    """
    if not list(root.children):
        return current_depth
    
    child_depths = [get_parse_tree_depth(child, current_depth + 1) for child in root.children]
    return max(child_depths) if child_depths else current_depth

def measure_hesitation_patterns(doc, preprocessed_text: str) -> Dict[str, float]:
    """
    Measure hesitation patterns in the text.
    
    Args:
        doc: spaCy document
        preprocessed_text: The preprocessed text
        
    Returns:
        Dictionary of hesitation metrics
    """
    # Count filler words
    filler_words = ["um", "uh", "er", "ah", "like", "you know", "sort of", "kind of"]
    filler_count = 0
    
    # Check all tokens for filler words
    for token in doc:
        if token.text.lower() in filler_words:
            filler_count += 1
    
    # Also check for multi-word fillers that might be missed as individual tokens
    for filler in ["you know", "sort of", "kind of"]:
        filler_count += preprocessed_text.count(filler)
    
    # Count repeated words (potential sign of hesitation)
    repeated_words_count = 0
    for i in range(1, len(doc)):
        if doc[i].text.lower() == doc[i-1].text.lower() and not doc[i].is_punct:
            repeated_words_count += 1
    
    # Count revisions/self-corrections (e.g., "I went to the, to the store")
    revision_patterns = 0
    for i in range(1, len(doc) - 2):
        # Pattern: token followed by same token with potential comma/pause between
        if (doc[i].text.lower() == doc[i+2].text.lower() and 
            (doc[i+1].is_punct or doc[i+1].text.lower() in ["uh", "um"])):
            revision_patterns += 1
    
    # Calculate normalized metrics
    total_words = len([token for token in doc if not token.is_punct])
    
    if total_words == 0:
        logger.warning("No words found for hesitation pattern analysis")
        return {
            "filler_ratio": 0.0,
            "repetition_ratio": 0.0,
            "revision_ratio": 0.0,
            "hesitation_score": 0.0
        }
    
    filler_ratio = filler_count / total_words if total_words > 0 else 0.0
    repetition_ratio = repeated_words_count / total_words if total_words > 0 else 0.0
    revision_ratio = revision_patterns / total_words if total_words > 0 else 0.0
    
    # Combine into an overall hesitation score
    # Higher weight on revisions as they're stronger indicators
    hesitation_score = (filler_ratio * 0.3) + (repetition_ratio * 0.3) + (revision_ratio * 0.4)
    
    return {
        "filler_ratio": filler_ratio,
        "repetition_ratio": repetition_ratio,
        "revision_ratio": revision_ratio,
        "hesitation_score": hesitation_score
    }

def detect_repetition_patterns(doc) -> Dict[str, float]:
    """
    Detect repetition patterns that may indicate cognitive decline.
    
    Args:
        doc: spaCy document
        
    Returns:
        Dictionary of repetition metrics
    """
    sentences = list(doc.sents)
    
    # Detect repeated content words
    content_words = [token.lemma_.lower() for token in doc 
                     if not token.is_stop and not token.is_punct and token.is_alpha]
    
    # Count word frequencies
    word_counter = Counter(content_words)
    
    # Count words that appear multiple times
    repeated_words = {word: count for word, count in word_counter.items() if count > 1}
    repetition_rate = len(repeated_words) / len(word_counter) if word_counter else 0
    
    # Detect repeated phrases (n-grams)
    repeated_bigrams = 0
    repeated_trigrams = 0
    
    # Convert to a simple list of tokens for n-gram extraction
    tokens = [token.text.lower() for token in doc]
    
    # Count bigrams (pairs of words)
    if len(tokens) >= 2:
        bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]
        bigram_counter = Counter(bigrams)
        repeated_bigrams = sum(1 for count in bigram_counter.values() if count > 1)
        bigram_repetition_rate = repeated_bigrams / len(bigram_counter) if bigram_counter else 0
    else:
        bigram_repetition_rate = 0.0
    
    # Count trigrams (triplets of words)
    if len(tokens) >= 3:
        trigrams = [f"{tokens[i]} {tokens[i+1]} {tokens[i+2]}" for i in range(len(tokens) - 2)]
        trigram_counter = Counter(trigrams)
        repeated_trigrams = sum(1 for count in trigram_counter.values() if count > 1)
        trigram_repetition_rate = repeated_trigrams / len(trigram_counter) if trigram_counter else 0
    else:
        trigram_repetition_rate = 0.0
    
    # Detect repeated sentence structures
    sentence_structures = []
    for sent in sentences:
        # Simplified structure: sequence of POS tags
        structure = " ".join([token.pos_ for token in sent])
        sentence_structures.append(structure)
    
    struct_counter = Counter(sentence_structures)
    repeated_structures = sum(1 for count in struct_counter.values() if count > 1)
    structure_repetition_rate = repeated_structures / len(struct_counter) if struct_counter else 0
    
    # Combine metrics into overall repetition score
    combined_repetition_score = (
        (repetition_rate * 0.4) +
        (bigram_repetition_rate * 0.3) +
        (trigram_repetition_rate * 0.2) +
        (structure_repetition_rate * 0.1)
    )
    
    return {
        "word_repetition_rate": repetition_rate,
        "bigram_repetition_rate": bigram_repetition_rate,
        "trigram_repetition_rate": trigram_repetition_rate,
        "structure_repetition_rate": structure_repetition_rate,
        "combined_repetition_score": combined_repetition_score
    }

def extract_linguistic_features(text: str) -> Dict[str, Any]:
    """
    Extract linguistic features from text for cognitive decline analysis.
    
    This function combines all feature extraction methods to provide a 
    comprehensive linguistic analysis.
    
    Args:
        text: Input text for analysis
        
    Returns:
        Dictionary containing all extracted features
    """
    if not nlp:
        logger.error("SpaCy model not loaded. Cannot extract linguistic features.")
        return {
            "success": False,
            "error": "SpaCy model not loaded"
        }
    
    try:
        # Preprocess the text
        preprocessed_text, preprocessing_metadata = preprocess_text(text)
        
        # Process with spaCy
        doc = nlp(preprocessed_text)
        
        # Extract all features
        lexical_features = calculate_lexical_diversity(doc)
        syntactic_features = calculate_syntactic_complexity(doc)
        hesitation_features = measure_hesitation_patterns(doc, preprocessed_text)
        repetition_features = detect_repetition_patterns(doc)
        
        # Combine all features
        all_features = {
            "success": True,
            "preprocessing_metadata": preprocessing_metadata,
            "lexical_diversity": lexical_features,
            "syntactic_complexity": syntactic_features,
            "hesitation_patterns": hesitation_features,
            "repetition_patterns": repetition_features
        }
        
        return all_features
    
    except Exception as e:
        logger.error(f"Error extracting linguistic features: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        } 