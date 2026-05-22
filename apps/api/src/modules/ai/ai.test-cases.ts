/**
 * AI Customer Support Test Cases
 * Run these manually to verify AI accuracy
 */

export const AI_TEST_CASES = [
  {
    category: 'Feature Explanation',
    tests: [
      {
        question: 'What is the Recognition system?',
        expectedKeywords: ['kudos', 'badges', 'points', 'leaderboard', 'peer'],
        expectedFormat: 'Detailed explanation with features',
      },
      {
        question: 'Explain the Knowledge Hub',
        expectedKeywords: ['articles', 'wiki', 'search', 'versioning', 'documentation'],
        expectedFormat: 'Description with capabilities',
      },
      {
        question: 'What features are available?',
        expectedKeywords: ['Dashboard', 'Feed', 'Announcements', 'Documents', 'Events'],
        expectedFormat: 'List of all 11 features',
      },
    ],
  },
  {
    category: 'How-To Questions',
    tests: [
      {
        question: 'How do I create a post?',
        expectedKeywords: ['Feed', 'Create Post', 'button', 'content', 'publish'],
        expectedFormat: 'Numbered steps',
      },
      {
        question: 'How can I give kudos to a colleague?',
        expectedKeywords: ['Recognition', 'Give Kudos', 'select', 'message', 'submit'],
        expectedFormat: 'Step-by-step guide',
      },
      {
        question: 'How do I upload documents?',
        expectedKeywords: ['Documents', 'Upload', 'files', 'folder', 'permissions'],
        expectedFormat: 'Clear instructions',
      },
      {
        question: 'How do I RSVP to an event?',
        expectedKeywords: ['Events', 'RSVP', 'Attend', 'Maybe', 'Decline'],
        expectedFormat: 'Action steps',
      },
    ],
  },
  {
    category: 'Navigation',
    tests: [
      {
        question: 'Where do I find the org chart?',
        expectedKeywords: ['People', 'directory', 'organizational chart', 'sidebar'],
        expectedFormat: 'Navigation path',
      },
      {
        question: 'How do I access the admin panel?',
        expectedKeywords: ['Admin', 'sidebar', 'admin role', 'permissions'],
        expectedFormat: 'Access instructions',
      },
      {
        question: 'Where can I see my recognition points?',
        expectedKeywords: ['Recognition', 'profile', 'points', 'leaderboard'],
        expectedFormat: 'Location guidance',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    tests: [
      {
        question: "I can't login, what should I do?",
        expectedKeywords: ['password', 'reset', 'cache', 'browser', 'support'],
        expectedFormat: 'List of solutions',
      },
      {
        question: 'My upload is failing',
        expectedKeywords: ['file size', 'format', 'connection', 'browser'],
        expectedFormat: 'Troubleshooting steps',
      },
      {
        question: "Why aren't my notifications working?",
        expectedKeywords: ['settings', 'browser', 'permissions', 'refresh'],
        expectedFormat: 'Diagnostic steps',
      },
    ],
  },
  {
    category: 'Context Awareness',
    tests: [
      {
        question: 'Tell me about the dashboard',
        followUp: 'What widgets are available?',
        expectedKeywords: ['AI digest', 'announcements', 'statistics', 'activity'],
        expectedFormat: 'Contextual answer about dashboard widgets',
      },
      {
        question: 'How does the Feed work?',
        followUp: 'Can I add images?',
        expectedKeywords: ['yes', 'attach', 'images', 'files', 'upload'],
        expectedFormat: 'Answer specific to Feed images',
      },
    ],
  },
  {
    category: 'Best Practices',
    tests: [
      {
        question: 'What are best practices for posting?',
        expectedKeywords: ['clear', 'hashtags', 'images', 'engage', 'regularly'],
        expectedFormat: 'List of recommendations',
      },
      {
        question: 'Tips for using the platform effectively',
        expectedKeywords: ['collaborate', 'recognize', 'share', 'participate'],
        expectedFormat: 'General guidance',
      },
    ],
  },
  {
    category: 'Technical Questions',
    tests: [
      {
        question: 'What technology stack is used?',
        expectedKeywords: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript', 'Grok AI'],
        expectedFormat: 'Technical details',
      },
      {
        question: 'What security features are in place?',
        expectedKeywords: ['JWT', 'RBAC', 'encryption', 'audit', 'rate limiting'],
        expectedFormat: 'Security overview',
      },
    ],
  },
  {
    category: 'Edge Cases',
    tests: [
      {
        question: 'asdfghjkl',
        expectedKeywords: ['help', 'clarify', 'rephrase', 'understand'],
        expectedFormat: 'Polite request for clarification',
      },
      {
        question: 'How do I use the quantum flux capacitor?',
        expectedKeywords: ['feature', 'available', 'help', 'features'],
        expectedFormat: 'Explanation that feature does not exist',
      },
    ],
  },
];

/**
 * Validation function to check AI response quality
 */
export function validateResponse(
  question: string,
  response: string,
  expectedKeywords: string[],
): {
  passed: boolean;
  score: number;
  missingKeywords: string[];
  feedback: string;
} {
  const lowerResponse = response.toLowerCase();
  const foundKeywords = expectedKeywords.filter((keyword) =>
    lowerResponse.includes(keyword.toLowerCase()),
  );
  const missingKeywords = expectedKeywords.filter(
    (keyword) => !lowerResponse.includes(keyword.toLowerCase()),
  );

  const score = (foundKeywords.length / expectedKeywords.length) * 100;
  const passed = score >= 60; // 60% threshold

  let feedback = '';
  if (passed) {
    feedback = `✅ PASSED (${score.toFixed(0)}%) - Response contains most expected keywords`;
  } else {
    feedback = `❌ FAILED (${score.toFixed(0)}%) - Missing key information: ${missingKeywords.join(', ')}`;
  }

  return {
    passed,
    score,
    missingKeywords,
    feedback,
  };
}

/**
 * Run all test cases (manual execution)
 */
export async function runAITests(chatFunction: (question: string) => Promise<string>) {
  console.log('🧪 Starting AI Customer Support Tests...\n');

  const results: {
    total: number;
    passed: number;
    failed: number;
    categories: Record<string, { passed: number; failed: number }>;
  } = {
    total: 0,
    passed: 0,
    failed: 0,
    categories: {},
  };

  for (const category of AI_TEST_CASES) {
    console.log(`\n📋 Category: ${category.category}`);
    console.log('='.repeat(50));

    results.categories[category.category] = { passed: 0, failed: 0 };

    for (const test of category.tests) {
      results.total++;

      try {
        console.log(`\n❓ Question: "${test.question}"`);

        const response = await chatFunction(test.question);
        console.log(`💬 Response: ${response.substring(0, 200)}...`);

        const validation = validateResponse(test.question, response, test.expectedKeywords);

        console.log(validation.feedback);

        if (validation.passed) {
          results.passed++;
          results.categories[category.category].passed++;
        } else {
          results.failed++;
          results.categories[category.category].failed++;
        }

        // Test follow-up if exists
        if ('followUp' in test) {
          console.log(`\n❓ Follow-up: "${test.followUp}"`);
          const followUpResponse = await chatFunction(test.followUp);
          console.log(`💬 Response: ${followUpResponse.substring(0, 200)}...`);
        }
      } catch (error: any) {
        console.error(`❌ Error: ${error.message}`);
        results.failed++;
        results.categories[category.category].failed++;
      }

      // Wait 2 seconds between tests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)`);

  console.log('\n📈 Results by Category:');
  Object.entries(results.categories).forEach(([category, stats]: [string, any]) => {
    console.log(`  ${category}: ${stats.passed}/${stats.passed + stats.failed} passed`);
  });

  return results;
}
