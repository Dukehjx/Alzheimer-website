"""
Text preprocessing utilities for language analysis.

This module provides functions to clean and normalize text data
before linguistic feature extraction and analysis.
"""

import re
import logging
import spacy
import nltk
from typing import List, Dict, Any, Optional, Tuple
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords

# Initialize logger
logger = logging.getLogger(__name__)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_lg")
    logger.info("Loaded spaCy model: en_core_web_lg")
except OSError:
    logger.warning("Could not load en_core_web_lg. Falling back to en_core_web_sm")
    try:
        nlp = spacy.load("en_core_web_sm")
        logger.info("Loaded spaCy model: en_core_web_sm")
    except OSError:
        logger.error("No spaCy model available. Run 'python -m spacy download en_core_web_lg'")
        nlp = None

# Common filler words and hesitation markers
FILLER_WORDS = set([
    "um", "uh", "er", "ah", "like", "you know", "actually", "basically", 
    "literally", "sort of", "kind of", "i mean", "well", "so", "anyway"
])

# Function to preprocess text
def preprocess_text(text: str) -> Tuple[str, Dict[str, Any]]:
    """
    Clean and normalize text for analysis.
    
    Args:
        text: Raw text input
        
    Returns:
        Tuple of (preprocessed_text, metadata)
    """
    if not text or not isinstance(text, str):
        logger.error("Invalid text input for preprocessing")
        return "", {"error": "Invalid text input", "original_length": 0, "processed_length": 0}
    
    # Store preprocessing metadata
    metadata = {
        "original_length": len(text),
        "filler_word_count": 0,
        "sentence_count": 0
    }
    
    # Lowercase text
    text = text.lower()
    
    # Replace multiple whitespaces with a single space
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep sentence punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\-\;\:\"\']', ' ', text)
    
    # Normalize sentence endings
    text = re.sub(r'[\.\!\?]+', '. ', text)
    
    # Normalize ellipsis (potential hesitation marker)
    text = re.sub(r'\.{2,}', '... ', text)
    
    # Count and mark filler words
    for filler in FILLER_WORDS:
        pattern = r'\b' + re.escape(filler) + r'\b'
        matches = re.findall(pattern, text)
        metadata["filler_word_count"] += len(matches)
    
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Count sentences (simple approximation)
    sentences = re.split(r'[.!?]+', text)
    metadata["sentence_count"] = sum(1 for s in sentences if s.strip())
    
    # Final metadata
    metadata["processed_length"] = len(text)
    
    return text, metadata

# Function to tokenize text
def tokenize_text(text: str) -> Dict[str, Any]:
    """
    Tokenize text using both NLTK and spaCy.
    
    Args:
        text: Preprocessed text input
        
    Returns:
        Dictionary containing tokenized text data
    """
    if not text:
        logger.error("Empty text for tokenization")
        return {
            "success": False,
            "error": "Empty text",
            "sentences": [],
            "tokens": [],
            "doc": None
        }
    
    try:
        # NLTK sentence tokenization
        sentences = sent_tokenize(text)
        
        # spaCy processing
        if nlp:
            doc = nlp(text)
            tokens = [token.text for token in doc]
            
            return {
                "success": True,
                "sentences": sentences,
                "tokens": tokens,
                "doc": doc
            }
        else:
            # Fallback to basic tokenization if spaCy not available
            tokens = text.split()
            logger.warning("Using basic tokenization (spaCy not available)")
            
            return {
                "success": True,
                "sentences": sentences,
                "tokens": tokens,
                "doc": None
            }
    
    except Exception as e:
        logger.error(f"Tokenization error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "sentences": [],
            "tokens": [],
            "doc": None
        }

# Function to get dependency trees
def get_sentence_dependency_trees(doc) -> List[Dict[str, Any]]:
    """
    Extract dependency trees from sentences.
    
    Args:
        doc: spaCy document
        
    Returns:
        List of sentence dependency trees
    """
    if not doc:
        return []
    
    dependency_trees = []
    
    for sent in doc.sents:
        tree = {}
        
        for token in sent:
            tree[token.i] = {
                "text": token.text,
                "pos": token.pos_,
                "tag": token.tag_,
                "dep": token.dep_,
                "head": token.head.i,
                "children": [child.i for child in token.children]
            }
        
        # Calculate tree depth
        max_depth = 0
        for token in sent:
            depth = 0
            current = token
            while current.dep_ != "ROOT" and depth < 20:  # Safety limit
                current = current.head
                depth += 1
            max_depth = max(max_depth, depth)
        
        dependency_trees.append({
            "sentence": sent.text,
            "tree": tree,
            "root": [t.i for t in sent if t.dep_ == "ROOT"],
            "depth": max_depth
        })
    
    return dependency_trees

# Function to mark hesitations
def mark_hesitations(tokens: List[str]) -> Dict[str, Any]:
    """
    Identify and mark hesitation patterns in text.
    
    Args:
        tokens: List of word tokens
        
    Returns:
        Dictionary with hesitation markers and statistics
    """
    if not tokens:
        return {
            "success": False,
            "error": "No tokens provided",
            "hesitation_count": 0,
            "hesitation_ratio": 0.0,
            "hesitation_indices": []
        }
    
    try:
        hesitation_indices = []
        
        # Check for filler words
        for i, token in enumerate(tokens):
            if token.lower() in FILLER_WORDS:
                hesitation_indices.append(i)
        
        # Check for repetitions (potential hesitation)
        for i in range(1, len(tokens) - 1):
            if tokens[i].lower() == tokens[i-1].lower() and tokens[i].lower() not in stopwords.words('english'):
                hesitation_indices.append(i)
        
        # Calculate statistics
        hesitation_count = len(hesitation_indices)
        hesitation_ratio = hesitation_count / len(tokens) if tokens else 0
        
        return {
            "success": True,
            "hesitation_count": hesitation_count,
            "hesitation_ratio": hesitation_ratio,
            "hesitation_indices": hesitation_indices
        }
        
    except Exception as e:
        logger.error(f"Error in hesitation analysis: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "hesitation_count": 0,
            "hesitation_ratio": 0.0,
            "hesitation_indices": []
        } 