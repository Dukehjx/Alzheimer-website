import React from 'react';
import { MemoryMatchGame } from '../components/cognitive-games';
import SiteMetadata from '../components/SiteMetadata';

export default function MemoryMatchPage() {
    return (
        <>
            <SiteMetadata
                title="Memory Match Game - NeuroAegis"
                description="Improve your memory, attention, and cognitive processing skills with our Memory Match game. Match question cards with their corresponding answers across multiple difficulty levels."
                keywords="memory game, cognitive training, brain training, memory match, alzheimer prevention, cognitive exercises"
            />
            <MemoryMatchGame />
        </>
    );
} 