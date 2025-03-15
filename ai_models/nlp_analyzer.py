"""
NLP Analyzer Module

This module implements Natural Language Processing techniques to analyze text
for linguistic patterns that may indicate cognitive decline.
"""

import re
import logging
import statistics
from typing import Dict, List, Any, Optional, Tuple, Set
from collections import Counter

import spacy
import textstat
from pydantic import BaseModel, Field

# Configure logging
logger = logging.getLogger(__name__)

# Default spaCy model
DEFAULT_SPACY_MODEL = "en_core_web_md"


class LinguisticFeatures(BaseModel):
    """Model for linguistic features extracted from text."""
    # Lexical diversity metrics
    vocabulary_size: int = Field(0, description="Number of unique words")
    type_token_ratio: float = Field(0.0, description="Ratio of unique words to total words")
    hapax_legomena_ratio: float = Field(0.0, description="Proportion of words used only once")
    
    # Syntactic complexity
    avg_sentence_length: float = Field(0.0, description="Average number of words per sentence")
    avg_word_length: float = Field(0.0, description="Average length of words")
    avg_tree_depth: float = Field(0.0, description="Average depth of dependency parse trees")
    readability_score: float = Field(0.0, description="Flesch-Kincaid grade level")
    
    # Fluency and cohesion
    hesitation_ratio: float = Field(0.0, description="Ratio of fillers and hesitations")
    repetition_ratio: float = Field(0.0, description="Proportion of repeated words/phrases")
    coherence_score: float = Field(0.0, description="Measure of text coherence")
    
    # POS tag distribution
    noun_ratio: float = Field(0.0, description="Proportion of nouns")
    verb_ratio: float = Field(0.0, description="Proportion of verbs")
    adjective_ratio: float = Field(0.0, description="Proportion of adjectives")
    adverb_ratio: float = Field(0.0, description="Proportion of adverbs")
    pronoun_ratio: float = Field(0.0, description="Proportion of pronouns")
    
    # Additional metrics
    word_frequency_score: float = Field(0.0, description="Average word frequency (common vs rare words)")
    sentence_complexity_variance: float = Field(0.0, description="Variance in sentence complexity")
    meta_linguistic_errors: int = Field(0, description="Count of grammatical/spelling errors")


class NLPAnalyzer:
    """
    Natural Language Processing analyzer for detecting cognitive decline markers.
    
    This class provides methods to analyze text for linguistic features that may
    indicate mild cognitive impairment (MCI) or early Alzheimer's disease.
    """
    
    def __init__(self, model_name: str = DEFAULT_SPACY_MODEL):
        """
        Initialize the NLP analyzer.
        
        Args:
            model_name: Name of the spaCy model to use
        """
        try:
            self.nlp = spacy.load(model_name)
            logger.info(f"Loaded spaCy model: {model_name}")
        except IOError:
            logger.warning(f"Failed to load {model_name}. Downloading...")
            spacy.cli.download(model_name)
            self.nlp = spacy.load(model_name)
            logger.info(f"Downloaded and loaded spaCy model: {model_name}")
        
        # Common fillers and hesitation words
        self.hesitation_terms = {
            "um", "uh", "er", "ah", "like", "you know", "i mean", 
            "sort of", "kind of", "hmm", "well", "so"
        }
        
        # Precompile some common regex patterns
        self.word_pattern = re.compile(r'\b\w+\b')
        self.sentence_pattern = re.compile(r'[.!?]+')
    
    def analyze_text(self, text: str) -> LinguisticFeatures:
        """
        Extract linguistic features from text that may indicate cognitive decline.
        
        Args:
            text: The text to analyze
            
        Returns:
            LinguisticFeatures object containing the extracted metrics
        """
        if not text or not text.strip():
            logger.warning("Empty text provided for analysis")
            return LinguisticFeatures()
        
        try:
            # Clean and normalize text
            cleaned_text = self._preprocess_text(text)
            
            # Parse with spaCy
            doc = self.nlp(cleaned_text)
            
            # Extract features
            features = LinguisticFeatures(
                # Lexical diversity
                **self._extract_lexical_diversity(doc),
                
                # Syntactic complexity
                **self._extract_syntactic_complexity(doc, cleaned_text),
                
                # Fluency and cohesion
                **self._extract_fluency_metrics(doc, cleaned_text),
                
                # POS distribution
                **self._extract_pos_distribution(doc),
                
                # Additional metrics
                **self._extract_additional_metrics(doc, cleaned_text)
            )
            
            logger.info(f"Completed linguistic analysis: vocabulary size={features.vocabulary_size}")
            return features
            
        except Exception as e:
            logger.exception(f"Error analyzing text: {e}")
            # Return default features instead of crashing
            return LinguisticFeatures()
    
    def _preprocess_text(self, text: str) -> str:
        """
        Clean and normalize text for analysis.
        
        Args:
            text: Raw text input
            
        Returns:
            Cleaned and normalized text
        """
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Normalize cases where appropriate (keep for analysis)
        # text = text.lower()
        
        return text
    
    def _extract_lexical_diversity(self, doc) -> Dict[str, Any]:
        """
        Extract metrics related to vocabulary richness and diversity.
        
        Args:
            doc: spaCy Doc object
            
        Returns:
            Dictionary of lexical diversity metrics
        """
        # Get all tokens, filtering out punctuation and whitespace
        tokens = [token.text.lower() for token in doc if not token.is_punct and not token.is_space]
        
        if not tokens:
            return {
                "vocabulary_size": 0,
                "type_token_ratio": 0.0,
                "hapax_legomena_ratio": 0.0
            }
        
        # Count tokens and unique tokens
        token_count = len(tokens)
        unique_tokens = set(tokens)
        vocabulary_size = len(unique_tokens)
        
        # Type-token ratio (TTR)
        type_token_ratio = vocabulary_size / token_count if token_count > 0 else 0
        
        # Count words that appear only once (hapax legomena)
        word_counts = Counter(tokens)
        hapax_words = [word for word, count in word_counts.items() if count == 1]
        hapax_ratio = len(hapax_words) / token_count if token_count > 0 else 0
        
        return {
            "vocabulary_size": vocabulary_size,
            "type_token_ratio": type_token_ratio,
            "hapax_legomena_ratio": hapax_ratio
        }
    
    def _extract_syntactic_complexity(self, doc, text: str) -> Dict[str, Any]:
        """
        Extract metrics related to syntactic complexity and structure.
        
        Args:
            doc: spaCy Doc object
            text: Original text
            
        Returns:
            Dictionary of syntactic complexity metrics
        """
        # Count sentences and words
        sentences = list(doc.sents)
        sentence_count = len(sentences)
        
        if sentence_count == 0:
            return {
                "avg_sentence_length": 0.0,
                "avg_word_length": 0.0,
                "avg_tree_depth": 0.0,
                "readability_score": 0.0
            }
        
        # Calculate average sentence length (in words)
        words_per_sentence = [
            len([token for token in sent if not token.is_punct and not token.is_space]) 
            for sent in sentences
        ]
        avg_sentence_length = statistics.mean(words_per_sentence) if words_per_sentence else 0
        
        # Calculate average word length
        words = [token.text for token in doc if not token.is_punct and not token.is_space]
        avg_word_length = statistics.mean([len(word) for word in words]) if words else 0
        
        # Calculate average parse tree depth
        tree_depths = []
        for sent in sentences:
            # Find the root
            root = [token for token in sent if token.head == token]
            if root:
                # Calculate the maximum depth from root
                max_depth = self._get_max_depth(root[0])
                tree_depths.append(max_depth)
        
        avg_tree_depth = statistics.mean(tree_depths) if tree_depths else 0
        
        # Calculate readability
        readability_score = textstat.flesch_kincaid_grade(text)
        
        return {
            "avg_sentence_length": avg_sentence_length,
            "avg_word_length": avg_word_length,
            "avg_tree_depth": avg_tree_depth,
            "readability_score": readability_score
        }
    
    def _get_max_depth(self, token, current_depth: int = 0) -> int:
        """
        Recursively calculate the maximum depth of a parse tree.
        
        Args:
            token: The current token
            current_depth: Current depth in the tree
            
        Returns:
            Maximum depth of the tree
        """
        children = list(token.children)
        if not children:
            return current_depth
        
        return max(self._get_max_depth(child, current_depth + 1) for child in children)
    
    def _extract_fluency_metrics(self, doc, text: str) -> Dict[str, Any]:
        """
        Extract metrics related to speech fluency and cohesion.
        
        Args:
            doc: spaCy Doc object
            text: Original text
            
        Returns:
            Dictionary of fluency metrics
        """
        # Get all tokens
        tokens = [token.text.lower() for token in doc if not token.is_punct and not token.is_space]
        
        if not tokens:
            return {
                "hesitation_ratio": 0.0,
                "repetition_ratio": 0.0,
                "coherence_score": 0.0
            }
        
        # Count hesitations/fillers
        hesitation_count = sum(1 for token in tokens if token in self.hesitation_terms)
        hesitation_ratio = hesitation_count / len(tokens) if tokens else 0
        
        # Find repeated words (excluding common function words)
        content_tokens = [
            token.text.lower() for token in doc 
            if not token.is_stop and not token.is_punct and not token.is_space
        ]
        
        repetition_count = 0
        if content_tokens:
            # Count words that repeat unusually often
            word_counts = Counter(content_tokens)
            # Consider repetition if a word appears more than twice and comprises more than 2% of content
            repetition_threshold = max(2, 0.02 * len(content_tokens))
            repetitions = [word for word, count in word_counts.items() if count > repetition_threshold]
            repetition_count = sum(word_counts[word] for word in repetitions)
        
        repetition_ratio = repetition_count / len(content_tokens) if content_tokens else 0
        
        # Calculate a simple coherence score based on presence of discourse markers and sentence transitions
        # This is a simplified approach - could be extended with more sophisticated coherence models
        coherence_markers = [
            "however", "therefore", "thus", "because", "since", "although", 
            "as a result", "in addition", "furthermore", "meanwhile", "nevertheless",
            "in conclusion", "first", "second", "finally", "in summary"
        ]
        
        coherence_marker_count = sum(1 for token in tokens if token.lower() in coherence_markers)
        sentence_count = len(list(doc.sents))
        
        # Calculate coherence score (scale 0-1)
        if sentence_count <= 1:
            coherence_score = 1.0  # Single sentence is inherently coherent
        else:
            # Heuristic: Expect roughly 1 discourse marker per 2-3 sentences in coherent text
            expected_markers = sentence_count / 2.5
            coherence_score = min(1.0, coherence_marker_count / expected_markers) if expected_markers > 0 else 0.0
        
        return {
            "hesitation_ratio": hesitation_ratio,
            "repetition_ratio": repetition_ratio,
            "coherence_score": coherence_score
        }
    
    def _extract_pos_distribution(self, doc) -> Dict[str, Any]:
        """
        Extract metrics related to parts-of-speech distribution.
        
        Args:
            doc: spaCy Doc object
            
        Returns:
            Dictionary of POS distribution metrics
        """
        # Count all tokens that aren't punctuation or whitespace
        content_tokens = [token for token in doc if not token.is_punct and not token.is_space]
        token_count = len(content_tokens)
        
        if token_count == 0:
            return {
                "noun_ratio": 0.0,
                "verb_ratio": 0.0,
                "adjective_ratio": 0.0,
                "adverb_ratio": 0.0,
                "pronoun_ratio": 0.0
            }
        
        # Count POS tags
        noun_count = sum(1 for token in content_tokens if token.pos_ in {"NOUN", "PROPN"})
        verb_count = sum(1 for token in content_tokens if token.pos_ == "VERB")
        adj_count = sum(1 for token in content_tokens if token.pos_ == "ADJ")
        adv_count = sum(1 for token in content_tokens if token.pos_ == "ADV")
        pronoun_count = sum(1 for token in content_tokens if token.pos_ == "PRON")
        
        # Calculate ratios
        return {
            "noun_ratio": noun_count / token_count,
            "verb_ratio": verb_count / token_count,
            "adjective_ratio": adj_count / token_count,
            "adverb_ratio": adv_count / token_count,
            "pronoun_ratio": pronoun_count / token_count
        }
    
    def _extract_additional_metrics(self, doc, text: str) -> Dict[str, Any]:
        """
        Extract additional linguistic metrics.
        
        Args:
            doc: spaCy Doc object
            text: Original text
            
        Returns:
            Dictionary of additional linguistic metrics
        """
        # Get content words (not stopwords, punctuation or whitespace)
        content_tokens = [
            token for token in doc 
            if not token.is_stop and not token.is_punct and not token.is_space
        ]
        
        if not content_tokens:
            return {
                "word_frequency_score": 0.0,
                "sentence_complexity_variance": 0.0,
                "meta_linguistic_errors": 0
            }
        
        # Word frequency estimation (using spaCy's frequency estimation via vectors)
        # Lower score = more rare words
        token_freqs = [token.rank if hasattr(token, 'rank') and token.rank else 0 for token in content_tokens]
        word_frequency_score = statistics.mean(token_freqs) / 1000000 if token_freqs else 0
        
        # Calculate variance in sentence complexity
        sentences = list(doc.sents)
        if len(sentences) > 1:
            sentence_complexities = [
                len([token for token in sent if not token.is_punct and not token.is_space])
                for sent in sentences
            ]
            sentence_complexity_variance = statistics.variance(sentence_complexities) if len(sentence_complexities) > 1 else 0
        else:
            sentence_complexity_variance = 0
        
        # Count potential grammatical/spelling errors (this is a placeholder - real implementation would use a proper grammar checker)
        # For demonstration, we're just counting words not in spaCy's vocabulary
        meta_linguistic_errors = sum(1 for token in content_tokens if not token.is_oov)
        
        return {
            "word_frequency_score": word_frequency_score,
            "sentence_complexity_variance": sentence_complexity_variance,
            "meta_linguistic_errors": meta_linguistic_errors
        } 