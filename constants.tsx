
import React from 'react';
import { 
  Calculator, 
  BookOpen, 
  History, 
  Clock, 
  Zap, 
  Lightbulb, 
  Library, 
  Globe, 
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { Subject, ModuleTab } from './types';

export const SUBJECT_CONFIG = {
  [Subject.TOAN]: {
    label: 'Toán Học',
    color: 'bg-blue-600',
    icon: <Calculator className="w-8 h-8" />,
    gradient: 'from-blue-500 to-indigo-700'
  },
  [Subject.GDKTPL]: {
    label: 'GDKTPL',
    color: 'bg-emerald-600',
    icon: <BookOpen className="w-8 h-8" />,
    gradient: 'from-emerald-500 to-teal-700'
  },
  [Subject.LICHSU]: {
    label: 'Lịch Sử',
    color: 'bg-amber-600',
    icon: <History className="w-8 h-8" />,
    gradient: 'from-amber-500 to-orange-700'
  },
  [Subject.TIME]: {
    label: 'Thời Gian',
    color: 'bg-rose-600',
    icon: <Clock className="w-8 h-8" />,
    gradient: 'from-rose-500 to-pink-700'
  }
};

export const TAB_CONFIG = {
  [ModuleTab.SPEED]: { label: 'Speed', icon: <Zap className="w-4 h-4" /> },
  [ModuleTab.SOCRATIC]: { label: 'Socratic', icon: <BrainCircuit className="w-4 h-4" /> },
  [ModuleTab.NOTEBOOKLM]: { label: 'NotebookLM', icon: <Library className="w-4 h-4" /> },
  [ModuleTab.PERPLEXITY]: { label: 'Perplexity', icon: <Globe className="w-4 h-4" /> },
  [ModuleTab.TOOLS]: { label: 'Fx 580 VNX', icon: <Cpu className="w-4 h-4" /> },
};
