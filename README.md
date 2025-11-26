# NutriVision - AI Comparative Nutrition Analysis

NutriVision is an advanced web application designed to demonstrate the impact of **Prompt Engineering** on Multimodal AI analysis. By utilizing Google's **Gemini 2.5 Flash** model, the application analyzes food images through three distinct cognitive "personas" simultaneously, offering users a comparative view of how different system instructions affect nutritional estimation.

## 🌟 Key Features

*   **Multi-Perspective Analysis**:
    *   **⚡ Rapid Visual Scan**: Simulates a quick glance, using heuristics and standard portion sizes for instant results.
    *   **🧠 Deep Chain-of-Thought**: Performs a step-by-step breakdown of ingredients, cooking methods (e.g., oil absorption), and density estimation.
    *   **🏥 Clinical Dietitian**: Applies a conservative, health-safety lens, often resulting in higher calorie estimates to account for hidden fats and sugars.
*   **Data Visualization**:
    *   **Consensus Radar**: Visualizes the variance in macro-nutrient (Carbs, Protein, Fat, Calories) estimates between the three models.
    *   **Performance Metrics**: Bar charts comparing the confidence score against the processing latency (ms) of each technique.
*   **Modern UI/UX**:
    *   Built with a high-contrast, accessibility-focused **OKLCH** color theme.
    *   Drag-and-drop image upload with instant preview.
    *   Fully responsive layout powered by Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18+ recommended)
*   **npm** or **yarn**
*   **Google AI Studio API Key**: Get one for free at [aistudio.google.com](https://aistudio.google.com/).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/nutrivision-ai.git
    cd nutrivision-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    *   Create a `.env` file in the root of your project.
    *   Add your API key:
        ```env
        API_KEY=your_gemini_api_key_here
        ```

4.  **Run the Application**
    ```bash
    npm start
    ```
    The app should now be running at `http://localhost:1234` (or your configured local port).

## 🛠️ Tech Stack

*   **Core**: React 19, TypeScript
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Styling**: Tailwind CSS with CSS Variables for theming
*   **Charts**: Recharts
*   **Icons**: Lucide React

## 🧠 The AI Techniques

The core of this application lies in `services/geminiService.ts`, where three distinct system instructions are defined:

1.  **RAPID_SCAN**:
    > "Identify the food in the image immediately... Do not overthink ingredients. Focus on the most likely standard dish."
2.  **DEEP_ANALYSIS**:
    > "Analyze: Visible ingredients and their ratios... Cooking methods... Density and volume... Use a Chain-of-Thought process."
3.  **HEALTH_OPTIMIZED**:
    > "Analyze this food for a patient with dietary restrictions. Tend to overestimate calories and fats slightly to be safe."

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.