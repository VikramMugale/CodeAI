// utils/openaiUtils.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // v0.24.0 uses v1beta

async function analyzeCode(code, language = "javascript") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert code reviewer. Your task is to analyze the following ${language} code and provide a detailed review.

REQUIREMENTS:
1. Identify all bugs, errors, security issues, and performance problems in the code
2. For each issue, provide:
   - The exact line number where the issue occurs
   - A clear explanation of what the issue is and why it's problematic
   - A complete code example showing how to fix the issue
   - The severity level (high/medium/low)

3. Provide an overall assessment of the code quality
4. Suggest specific improvements with code examples
5. Explain why each change is necessary

FORMAT YOUR RESPONSE AS FOLLOWS:

OVERALL ASSESSMENT:
[Provide a comprehensive assessment of the code quality, major issues, and general recommendations]

DETAILED ANALYSIS:

ISSUE 1: [Issue Title]
- Line: [Line number]
- Severity: [high/medium/low]
- Description: [Detailed explanation of the issue]
- Impact: [What problems this issue could cause]
- Solution: [Explanation of how to fix it]
- Code Example:
\`\`\`${language}
[Complete code example showing the fix]
\`\`\`

ISSUE 2: [Issue Title]
[... same format as above]

RECOMMENDATIONS:
1. [Recommendation with explanation]
   \`\`\`${language}
   [Code example]
   \`\`\`

2. [Recommendation with explanation]
   \`\`\`${language}
   [Code example]
   \`\`\`

IMPORTANT:
- Be specific and detailed in your explanations
- Provide complete, working code examples for each issue and recommendation
- Explain why each change is necessary and what problems it solves
- Focus on practical, actionable improvements

Code to review:
\`\`\`${language}
${code}
\`\`\`
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const text = result.response.text();
    
    // Parse the response into structured feedback
    const feedbackItems = [];
    
    // Add overall assessment as first feedback item
    const overallAssessmentMatch = text.match(/OVERALL ASSESSMENT:([\s\S]*?)(?=DETAILED ANALYSIS:|ISSUE 1:|$)/i);
    if (overallAssessmentMatch) {
      feedbackItems.push({
        line: 0,
        severity: "info",
        message: "Overall Assessment",
        suggestion: overallAssessmentMatch[1].trim()
      });
    } else {
      // Fallback if the format doesn't match
      const firstParagraph = text.split('\n\n')[0];
      feedbackItems.push({
        line: 0,
        severity: "info",
        message: "Overall Assessment",
        suggestion: firstParagraph.trim()
      });
    }
    
    // Extract issues
    const issueMatches = text.match(/ISSUE \d+:([\s\S]*?)(?=ISSUE \d+:|RECOMMENDATIONS:|$)/gi);
    if (issueMatches) {
      for (const issueMatch of issueMatches) {
        const lineMatch = issueMatch.match(/Line:?\s*(\d+)/i);
        const severityMatch = issueMatch.match(/Severity:?\s*(high|medium|low)/i);
        const descriptionMatch = issueMatch.match(/Description:([\s\S]*?)(?=Impact:|Solution:|Code Example:|$)/i);
        const impactMatch = issueMatch.match(/Impact:([\s\S]*?)(?=Solution:|Code Example:|$)/i);
        const solutionMatch = issueMatch.match(/Solution:([\s\S]*?)(?=Code Example:|$)/i);
        const codeExampleMatch = issueMatch.match(/Code Example:([\s\S]*?)(?=ISSUE \d+:|RECOMMENDATIONS:|$)/i);
        
        const line = lineMatch ? parseInt(lineMatch[1]) : 0;
        const severity = severityMatch ? severityMatch[1].toLowerCase() : 'medium';
        const message = descriptionMatch ? descriptionMatch[1].trim() : 'Issue identified';
        
        let suggestion = '';
        if (impactMatch) {
          suggestion += 'Impact: ' + impactMatch[1].trim() + '\n\n';
        }
        if (solutionMatch) {
          suggestion += 'Solution: ' + solutionMatch[1].trim() + '\n\n';
        }
        if (codeExampleMatch) {
          suggestion += 'Code Example:\n' + codeExampleMatch[1].trim();
        }
        
        if (suggestion) {
          feedbackItems.push({
            line,
            severity,
            message,
            suggestion
          });
        }
      }
    }
    
    // Extract recommendations
    const recommendationsMatch = text.match(/RECOMMENDATIONS:([\s\S]*?)$/i);
    if (recommendationsMatch) {
      const recommendationsText = recommendationsMatch[1];
      const recommendationMatches = recommendationsText.match(/\d+\.\s*([\s\S]*?)(?=\d+\.|$)/g);
      
      if (recommendationMatches) {
        for (const recommendationMatch of recommendationMatches) {
          const recommendationText = recommendationMatch.replace(/^\d+\.\s*/, '').trim();
          const codeExampleMatch = recommendationText.match(/```[\s\S]*?```/);
          
          let message = recommendationText;
          let suggestion = '';
          
          if (codeExampleMatch) {
            const codeExample = codeExampleMatch[0];
            message = recommendationText.replace(codeExample, '').trim();
            suggestion = codeExample;
          }
          
          feedbackItems.push({
            line: 0,
            severity: 'info',
            message: 'Recommendation: ' + message,
            suggestion
          });
        }
      }
    }
    
    // If we couldn't parse structured feedback, create a simple feedback item
    if (feedbackItems.length === 0) {
      feedbackItems.push({
        line: 0,
        severity: 'info',
        message: 'Code Review',
        suggestion: text.replace(/\*\*/g, '').trim()
      });
    }

    return {
      success: true,
      feedback: feedbackItems
    };
  } catch (err) {
    console.error("❌ Gemini Analysis Error:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { analyzeCode };
