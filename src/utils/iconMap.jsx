// Maps icon name strings (stored in Firestore) to Lucide React components
import { Layout, Smartphone, Database, Cpu, Code2, Server, Github, Globe, Layers, Terminal, Box, Zap } from 'lucide-react';

export const ICON_MAP = {
    Layout, Smartphone, Database, Cpu, Code2, Server, Github,
    Globe, Layers, Terminal, Box, Zap
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export const getIcon = (name, size = 28) => {
    const Icon = ICON_MAP[name] || Code2;
    return <Icon size={size} />;
};
