import { AI_TECHNIQUE } from './types';

// Using consistent iconography and colors for techniques
// Mapping to theme chart colors:
// Rapid Scan (Blue/Cyan) -> Chart 2
// Deep Analysis (Purple) -> Chart 1
// Health Optimized (Green) -> Chart 5

export const TECHNIQUE_CONFIGS = {
  [AI_TECHNIQUE.RAPID_SCAN]: {
    name: 'Rapid Visual Scan',
    description: 'Quick estimation based on visual heuristics and dominant features.',
    color: 'var(--chart-2)', // Cyan/Teal
    model: 'gemini-2.5-flash',
  },
  [AI_TECHNIQUE.DEEP_ANALYSIS]: {
    name: 'Chain-of-Thought Analytical',
    description: 'Detailed breakdown of ingredients, density, and cooking methods.',
    color: 'var(--chart-1)', // Purple
    model: 'gemini-2.5-flash', // Using flash but with complex prompting
  },
  [AI_TECHNIQUE.HEALTH_OPTIMIZED]: {
    name: 'Clinical Dietitian Review',
    description: 'Conservative estimation focused on nutritional density and hidden calories.',
    color: 'var(--chart-5)', // Green
    model: 'gemini-2.5-flash',
  },
};

export const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', // Salad
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // Pizza
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', // Cake
];