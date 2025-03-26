"""
Linguistic Pattern Detection Algorithms.

This module implements specialized algorithms for detecting linguistic patterns
that may indicate cognitive decline, including repetition patterns, hesitations,
grammatical errors, and word finding difficulties.
"""

import logging
import re
from typing import Dict, Any, List, Optional, Set, Tuple
import numpy as np
from collections import Counter

from app.ai.nlp.preprocessing import tokenize_text, nlp

# Initialize logger
logger = logging.getLogger(__name__)

def detect_word_repetition_clusters(tokens: List[str], window_size: int = 5) -> Dict[str, Any]:
    """
    Detect clusters of word repetitions in close proximity.
    
    Args:
        tokens: List of tokens from the text
        window_size: Size of the sliding window to check for repetitions
        
    Returns:
        Dictionary containing repetition cluster information
    """
    if not tokens or len(tokens) < window_size:
        return {
            "clusters": [],
            "total_clusters": 0,
            "cluster_density": 0.0
        }
    
    clusters = []
    current_cluster = None
    
    for i in range(len(tokens) - 1):
        # Skip punctuation tokens
        if tokens[i].strip() in ",.!?;:'\"()[]{}":
            continue
            
        # Look for repetitions within the window
        for j in range(i + 1, min(i + window_size, len(tokens))):
            if tokens[i].lower() == tokens[j].lower():
                # Found a repetition
                if current_cluster is None or j > current_cluster["end_idx"]:
                    # Start a new cluster
                    current_cluster = {
                        "start_idx": i,
                        "end_idx": j,
                        "repeated_word": tokens[i],
                        "context": " ".join(tokens[max(0, i-2):min(len(tokens), j+3)])
                    }
                    clusters.append(current_cluster)
                else:
                    # Extend the current cluster
                    current_cluster["end_idx"] = j
                    current_cluster["context"] = " ".join(tokens[max(0, current_cluster["start_idx"]-2):
                                                         min(len(tokens), j+3)])
    
    # Calculate cluster density (clusters per 100 tokens)
    cluster_density = len(clusters) * 100 / len(tokens) if tokens else 0
    
    return {
        "clusters": clusters,
        "total_clusters": len(clusters),
        "cluster_density": cluster_density
    }

def detect_grammatical_errors(doc) -> Dict[str, Any]:
    """
    Detect potential grammatical errors in the text.
    
    Args:
        doc: spaCy document
        
    Returns:
        Dictionary containing grammatical error information
    """
    if not doc:
        return {
            "error_count": 0,
            "error_rate": 0.0,
            "error_types": {}
        }
    
    errors = []
    error_types = Counter()
    
    # Check for subject-verb agreement errors
    for sent in doc.sents:
        subjects = []
        verbs = []
        
        for token in sent:
            # Find subjects
            if token.dep_ in ("nsubj", "nsubjpass"):
                subjects.append(token)
            # Find verbs
            if token.pos_ == "VERB":
                verbs.append(token)
        
        # Simple check: if we have both subject(s) and verb(s), check agreement
        if subjects and verbs:
            for subj in subjects:
                for verb in verbs:
                    # Skip if they're not related
                    if verb.i not in [t.i for t in subj.head.rights] and verb != subj.head:
                        continue
                        
                    # Simple subject-verb agreement check (English)
                    if subj.morph.get("Number") and verb.morph.get("Number") and \
                       subj.morph.get("Number")[0] != verb.morph.get("Number")[0]:
                        errors.append({
                            "type": "subject_verb_agreement",
                            "context": " ".join([t.text for t in sent]),
                            "subject": subj.text,
                            "verb": verb.text
                        })
                        error_types["subject_verb_agreement"] += 1
    
    # Check for determiner-noun agreement errors
    for token in doc:
        if token.pos_ == "DET" and token.dep_ == "det":
            head = token.head
            if head.pos_ == "NOUN":
                # Check determiner-noun agreement
                if token.text.lower() in ["a", "an"]:
                    # Check for "a" vs "an" errors
                    if token.text.lower() == "a" and head.text[0].lower() in "aeiou":
                        errors.append({
                            "type": "determiner_noun_agreement",
                            "context": f"{token.text} {head.text}",
                            "determiner": token.text,
                            "noun": head.text
                        })
                        error_types["determiner_noun_agreement"] += 1
                    elif token.text.lower() == "an" and head.text[0].lower() not in "aeiou":
                        errors.append({
                            "type": "determiner_noun_agreement",
                            "context": f"{token.text} {head.text}",
                            "determiner": token.text,
                            "noun": head.text
                        })
                        error_types["determiner_noun_agreement"] += 1
    
    # Calculate error rate (errors per 100 tokens)
    total_tokens = len(doc)
    error_rate = len(errors) * 100 / total_tokens if total_tokens > 0 else 0
    
    return {
        "errors": errors,
        "error_count": len(errors),
        "error_rate": error_rate,
        "error_types": dict(error_types)
    }

def detect_word_finding_difficulties(doc) -> Dict[str, Any]:
    """
    Detect potential word finding difficulties in the text.
    
    Args:
        doc: spaCy document
        
    Returns:
        Dictionary containing word finding difficulty information
    """
    if not doc:
        return {
            "indicators": [],
            "indicator_count": 0,
            "indicator_rate": 0.0
        }
    
    indicators = []
    
    # Common circumlocution patterns (describing instead of naming)
    circumlocution_markers = [
        "thing", "stuff", "something", "whatchamacallit", "whatnot", "whatsit", 
        "thingy", "things", "it's like", "kind of like"
    ]
    
    # Detect use of generic terms instead of specific nouns
    for token in doc:
        if token.text.lower() in circumlocution_markers:
            indicators.append({
                "type": "circumlocution",
                "word": token.text,
                "context": " ".join([t.text for t in doc[max(0, token.i-3):min(len(doc), token.i+4)]])
            })
    
    # Detect word retrieval pauses or verbal fillers followed by content words
    for i in range(len(doc) - 1):
        if doc[i].text.lower() in ["um", "uh", "er", "hmm"] and doc[i+1].pos_ in ["NOUN", "VERB", "ADJ"]:
            indicators.append({
                "type": "retrieval_pause",
                "marker": doc[i].text,
                "word": doc[i+1].text,
                "context": " ".join([t.text for t in doc[max(0, i-2):min(len(doc), i+3)]])
            })
    
    # Detect empty phrases like "I can't think of the word"
    empty_phrase_patterns = [
        r"(?i)can't\s+think\s+of\s+the\s+word",
        r"(?i)what's\s+it\s+called",
        r"(?i)you\s+know\s+what\s+I\s+mean",
        r"(?i)what\s+do\s+you\s+call\s+it"
    ]
    
    for pattern in empty_phrase_patterns:
        for match in re.finditer(pattern, doc.text):
            indicators.append({
                "type": "empty_phrase",
                "phrase": match.group(0),
                "context": doc.text[max(0, match.start()-20):min(len(doc.text), match.end()+20)]
            })
    
    # Calculate indicator rate (indicators per 100 tokens)
    total_tokens = len(doc)
    indicator_rate = len(indicators) * 100 / total_tokens if total_tokens > 0 else 0
    
    return {
        "indicators": indicators,
        "indicator_count": len(indicators),
        "indicator_rate": indicator_rate
    }

def detect_linguistic_patterns(text: str) -> Dict[str, Any]:
    """
    Detect various linguistic patterns in text that may indicate cognitive decline.
    
    Args:
        text: Text to analyze
        
    Returns:
        Dictionary containing detected patterns
    """
    if not text or not isinstance(text, str):
        logger.error("Invalid text input for pattern detection")
        return {
            "success": False,
            "error": "Invalid text input"
        }
    
    try:
        # Tokenize the text
        tokenization_result = tokenize_text(text)
        
        if not tokenization_result["success"]:
            return {
                "success": False,
                "error": f"Tokenization failed: {tokenization_result.get('error', 'Unknown error')}"
            }
        
        tokens = tokenization_result["tokens"]
        doc = tokenization_result["doc"]
        
        # Detect various patterns
        results = {
            "success": True,
            "word_repetition_clusters": detect_word_repetition_clusters(tokens),
            "grammatical_errors": detect_grammatical_errors(doc) if doc else {"error_count": 0, "error_rate": 0},
            "word_finding_difficulties": detect_word_finding_difficulties(doc) if doc else {"indicator_count": 0}
        }
        
        # Calculate combined pattern score (higher means more potential issues)
        # This is a simple weighted average of different pattern indicators
        pattern_indicators = [
            results["word_repetition_clusters"]["cluster_density"] * 0.4,
            results["grammatical_errors"]["error_rate"] * 0.3,
            results["word_finding_difficulties"]["indicator_rate"] * 0.3
        ]
        
        results["combined_pattern_score"] = sum(pattern_indicators) / len(pattern_indicators) / 10
        
        # Normalize to 0-1 range
        results["combined_pattern_score"] = min(1.0, max(0.0, results["combined_pattern_score"]))
        
        return results
    
    except Exception as e:
        logger.error(f"Pattern detection failed: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"Pattern detection failed: {str(e)}"
        } 