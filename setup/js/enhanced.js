// Enhanced NASA-TLX JavaScript for user study
// Click-based rating system with one question at a time

$(document).ready(function() {
    
    // Hide all steps initially except welcome
    $(".step_0, .step_1, .step_2, .step_3, .step_4").hide();
    
    // Rating questions configuration
    const ratingQuestions = [
        {
            id: 'mentalDemand',
            title: 'Mental Demand',
            question: 'How much mental and perceptual activity was required when using Memento?',
            explanation: 'Was the task with Memento easy or demanding, simple or complex, exacting or forgiving? Consider thinking, deciding, calculating, remembering, looking, searching, etc.',
            leftLabel: 'Low',
            rightLabel: 'High'
        },
        {
            id: 'physicalDemand', 
            title: 'Physical Demand',
            question: 'How much physical activity was required when using Memento?',
            explanation: 'Was the task easy or demanding, slow or brisk, slack or strenuous, restful or laborious? Consider pushing, pulling, turning, controlling, activating, etc.',
            leftLabel: 'Low',
            rightLabel: 'High'
        },
        {
            id: 'temporalDemand',
            title: 'Temporal Demand', 
            question: 'How much time pressure did you feel due to the rate of pace when using Memento?',
            explanation: 'Was the pace slow and leisurely or rapid and frantic? Did you feel you had enough time or were you rushed?',
            leftLabel: 'Low',
            rightLabel: 'High'
        },
        {
            id: 'performance',
            title: 'Performance',
            question: 'How successful do you think you were in accomplishing the goals when using Memento?',
            explanation: 'How satisfied were you with your performance in accomplishing these goals? Did you achieve what you intended to do with Memento?',
            leftLabel: 'Poor',
            rightLabel: 'Good'
        },
        {
            id: 'effort',
            title: 'Effort',
            question: 'How hard did you have to work (mentally and physically) to accomplish your level of performance with Memento?',
            explanation: 'Consider the amount of mental and physical effort you had to exert to achieve your performance level.',
            leftLabel: 'Low',
            rightLabel: 'High'
        },
        {
            id: 'frustration',
            title: 'Frustration',
            question: 'How insecure, discouraged, irritated, stressed and annoyed were you while using Memento?',
            explanation: 'How secure, gratified, content, relaxed and complacent versus insecure, discouraged, irritated, stressed and annoyed did you feel during the task?',
            leftLabel: 'Low',
            rightLabel: 'High'
        }
    ];
    
    let currentQuestionIndex = 0;
    let ratings = {};
    
    // Step 1 button handler 
    $(".step_1 button").off('click').on('click', function() {
        if ($(this).text().includes('Continue to Ratings')) {
            // Initialize rating questions
            initializeRatingQuestions();
            showCurrentQuestion();
            
            // Show step 2
            $(".step_1").hide();
            $(".step_2").show();
        }
    });
    
    // Initialize the rating questions interface
    function initializeRatingQuestions() {
        currentQuestionIndex = 0;
        ratings = {};
    }
    
    // Show the current question
    function showCurrentQuestion() {
        const question = ratingQuestions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / ratingQuestions.length) * 100;
        
        const html = `
            <div class="rating-question">
                <div class="question-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                
                <h2>Question ${currentQuestionIndex + 1} of ${ratingQuestions.length}</h2>
                <h3>${question.title}</h3>
                <p style="font-size: 1.1rem; margin: 1.5rem 0; font-weight: 600;">${question.question}</p>
                <p style="font-size: 1rem; margin: 1rem 0; color: #6c757d; line-height: 1.5; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">${question.explanation}</p>
                
                <div class="rating-scale">
                    <div class="tick-container">
                        <div class="tick-line"></div>
                        ${generateTicks(question.id)}
                    </div>
                </div>
                
                <div class="scale-labels">
                    <span>${question.leftLabel}</span>
                    <span>${question.rightLabel}</span>
                </div>
                
                <div class="current-rating" id="current-rating">
                    ${ratings[question.id] !== undefined ? `Selected: ${ratings[question.id]}` : 'Please select a rating'}
                </div>
                
                <div class="question-navigation">
                    ${currentQuestionIndex > 0 ? 
                        '<button class="btn btn-secondary" onclick="previousQuestion()">← Previous Question</button>' : 
                        '<button class="btn btn-secondary" onclick="goBackToConfirmation()">← Back to Details</button>'
                    }
                    <button class="btn btn-primary" onclick="nextQuestion()" ${ratings[question.id] === undefined ? 'disabled' : ''}>
                        ${currentQuestionIndex < ratingQuestions.length - 1 ? 'Next Question →' : 'Continue to Comparisons →'}
                    </button>
                </div>
            </div>
        `;
        
        $('#rating_container').html(html);
        
        // Add click handlers for ticks
        $('.tick').on('click', function() {
            const value = parseInt($(this).data('value'));
            selectRating(question.id, value);
        });
    }
    
    // Generate tick marks for rating scale
    function generateTicks(questionId) {
        let ticks = '';
        // Create 11 tick marks (0, 10, 20, ... 100)
        for (let i = 0; i <= 100; i += 10) {
            const isSelected = ratings[questionId] === i ? 'selected' : '';
            ticks += `<div class="tick ${isSelected}" data-value="${i}">${i}</div>`;
        }
        return ticks;
    }
    
    // Handle rating selection
    function selectRating(questionId, value) {
        ratings[questionId] = value;
        
        // Update visual selection
        $('.tick').removeClass('selected');
        $(`.tick[data-value="${value}"]`).addClass('selected');
        
        // Update current rating display
        $('#current-rating').text(`Selected: ${value}`);
        
        // Enable next button
        $('.question-navigation .btn-primary').prop('disabled', false);
    }
    
    // Navigation functions (need to be global)
    window.nextQuestion = function() {
        const question = ratingQuestions[currentQuestionIndex];
        
        // Ensure rating is selected
        if (ratings[question.id] === undefined) {
            alert('Please select a rating before continuing.');
            return;
        }
        
        if (currentQuestionIndex < ratingQuestions.length - 1) {
            currentQuestionIndex++;
            showCurrentQuestion();
        } else {
            // All questions completed, save data and move to step 3
            saveRatingData();
            initializePairwiseComparisons();
            
            // Show step 3
            $(".step_2").hide();
            $(".step_3").show();
        }
    };
    
    window.previousQuestion = function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showCurrentQuestion();
        }
    };
    
    // Go back to confirmation page (Step 1)
    window.goBackToConfirmation = function() {
        // Hide step 2 and show step 1
        $(".step_2").hide();
        $(".step_1").show();
    };
    
    // Save rating data to global structure
    function saveRatingData() {
        currentAssessment.ratings = {
            mentalDemand: ratings.mentalDemand || 0,
            physicalDemand: ratings.physicalDemand || 0,
            temporalDemand: ratings.temporalDemand || 0,
            performance: ratings.performance || 0,
            effort: ratings.effort || 0,
            frustration: ratings.frustration || 0
        };
        
        console.log('Rating data saved:', currentAssessment.ratings);
    }
    
    // Initialize pairwise comparisons - one at a time
    let currentPairIndex = 0;
    let pairwiseComparisons = {};
    let allPairs = [];
    
    function initializePairwiseComparisons() {
        const demands = [
            {
                id: "md", 
                name: "Mental Demand",
                description: "How much mental and perceptual activity was required when using Memento? (thinking, deciding, calculating, remembering, looking, searching, etc.)"
            },
            {
                id: "pd", 
                name: "Physical Demand",
                description: "How much physical activity was required when using Memento? (pushing, pulling, turning, controlling, activating, etc.)"
            },
            {
                id: "td", 
                name: "Temporal Demand",
                description: "How much time pressure did you feel due to the rate of pace when using Memento?"
            },
            {
                id: "op", 
                name: "Performance",
                description: "How successful do you think you were in accomplishing the goals when using Memento?"
            },
            {
                id: "ef", 
                name: "Effort",
                description: "How hard did you have to work (mentally and physically) to accomplish your level of performance with Memento?"
            },
            {
                id: "fr", 
                name: "Frustration",
                description: "How insecure, discouraged, irritated, stressed and annoyed were you while using Memento?"
            }
        ];
        
        // Generate all possible pairs
        allPairs = [];
        for (let i = 0; i < demands.length; i++) {
            for (let j = i + 1; j < demands.length; j++) {
                allPairs.push([demands[i], demands[j]]);
            }
        }
        
        // Shuffle pairs for random order
        for (let i = allPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
        }
        
        currentPairIndex = 0;
        pairwiseComparisons = {};
        showCurrentPairwiseQuestion();
    }
    
    // Show current pairwise comparison question
    function showCurrentPairwiseQuestion() {
        const pair = allPairs[currentPairIndex];
        const progress = ((currentPairIndex + 1) / allPairs.length) * 100;
        
        const html = `
            <div class="rating-question">
                <div class="question-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                
                <h2>Comparison ${currentPairIndex + 1} of ${allPairs.length}</h2>
                <h3>Pairwise Comparison</h3>
                <p style="font-size: 1.1rem; margin: 1.5rem 0; font-weight: 600;">Which factor contributed MORE to the workload when using Memento?</p>
                
                <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; margin: 2rem auto;">
                    <div class="comparison-option" data-choice="0" style="padding: 1.5rem; border: 2px solid #dee2e6; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #007bff;">${pair[0].name}</h4>
                        <p style="margin: 0; color: #6c757d; font-size: 0.9rem; line-height: 1.4;">${pair[0].description}</p>
                    </div>
                    
                    <div style="text-align: center; font-weight: bold; color: #6c757d;">OR</div>
                    
                    <div class="comparison-option" data-choice="1" style="padding: 1.5rem; border: 2px solid #dee2e6; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #007bff;">${pair[1].name}</h4>
                        <p style="margin: 0; color: #6c757d; font-size: 0.9rem; line-height: 1.4;">${pair[1].description}</p>
                    </div>
                </div>
                
                <div class="current-rating" id="current-pairing">
                    ${pairwiseComparisons[currentPairIndex] !== undefined ? `Selected: ${pair[pairwiseComparisons[currentPairIndex]].name}` : 'Please select one option'}
                </div>
                
                <div class="question-navigation">
                    ${currentPairIndex > 0 ? 
                        '<button class="btn btn-secondary" onclick="previousPairwise()">← Previous Comparison</button>' : 
                        '<button class="btn btn-secondary" onclick="goBackToRatings()">← Back to Ratings</button>'
                    }
                    <button class="btn btn-primary" onclick="nextPairwise()" ${pairwiseComparisons[currentPairIndex] === undefined ? 'disabled' : ''}>
                        ${currentPairIndex < allPairs.length - 1 ? 'Next Comparison →' : 'Complete Assessment →'}
                    </button>
                </div>
            </div>
        `;
        
        $('#pairwise_container').html(html);
        
        // Add click handlers for comparison options
        $('.comparison-option').on('click', function() {
            const choice = parseInt($(this).data('choice'));
            selectPairwiseOption(choice);
        });
    }
    
    // Handle pairwise selection
    function selectPairwiseOption(choice) {
        pairwiseComparisons[currentPairIndex] = choice;
        
        // Update visual selection
        $('.comparison-option').css({
            'border-color': '#dee2e6',
            'background-color': 'white'
        });
        $(`.comparison-option[data-choice="${choice}"]`).css({
            'border-color': '#007bff',
            'background-color': '#e3f2fd'
        });
        
        // Update current selection display
        const pair = allPairs[currentPairIndex];
        $('#current-pairing').text(`Selected: ${pair[choice].name}`);
        
        // Enable next button
        $('.question-navigation .btn-primary').prop('disabled', false);
    }
    
    // Navigation functions for pairwise comparisons
    window.nextPairwise = function() {
        if (pairwiseComparisons[currentPairIndex] === undefined) {
            alert('Please select one option before continuing.');
            return;
        }
        
        if (currentPairIndex < allPairs.length - 1) {
            currentPairIndex++;
            showCurrentPairwiseQuestion();
        } else {
            // All comparisons completed
            savePairwiseData();
            calculateTLXScore();
            saveToLocalStorage();
            
            // Show step 4 and automatically submit
            $(".step_3").hide();
            $(".step_4").show();
            
            // Automatically submit the data
            autoSubmitData();
        }
    };
    
    window.previousPairwise = function() {
        if (currentPairIndex > 0) {
            currentPairIndex--;
            showCurrentPairwiseQuestion();
        }
    };
    
    window.goBackToRatings = function() {
        // Reset to last rating question
        currentQuestionIndex = ratingQuestions.length - 1;
        showCurrentQuestion();
        
        $(".step_3").hide();
        $(".step_2").show();
    };
    
    // Save pairwise data
    function savePairwiseData() {
        currentAssessment.comparisons = {};
        Object.keys(pairwiseComparisons).forEach(pairIndex => {
            currentAssessment.comparisons[pairIndex] = pairwiseComparisons[pairIndex];
        });
        
        // Store pairs for TLX calculation
        window.comparisonPairs = allPairs;
        
        console.log('Pairwise data saved:', currentAssessment.comparisons);
    }
    
    // Validate that all pairwise comparisons are completed
    function validatePairwiseComparisons() {
        const totalPairs = window.comparisonPairs ? window.comparisonPairs.length : 0;
        const completedPairs = Object.keys(currentAssessment.comparisons).length;
        
        return completedPairs === totalPairs;
    }
    
    // Calculate TLX score based on ratings and comparisons
    function calculateTLXScore() {
        const demands = ['mentalDemand', 'physicalDemand', 'temporalDemand', 'performance', 'effort', 'frustration'];
        const weights = new Array(6).fill(0);
        
        // Calculate weights from pairwise comparisons
        Object.keys(currentAssessment.comparisons).forEach(pairIndex => {
            const choice = currentAssessment.comparisons[pairIndex];
            const pair = window.comparisonPairs[pairIndex];
            
            if (choice === 0) {
                // First item was selected
                const demandIndex = demands.findIndex(d => d === getSlugFromName(pair[0][1]));
                if (demandIndex !== -1) weights[demandIndex]++;
            } else {
                // Second item was selected
                const demandIndex = demands.findIndex(d => d === getSlugFromName(pair[1][1]));
                if (demandIndex !== -1) weights[demandIndex]++;
            }
        });
        
        // Calculate weighted score
        let weightedSum = 0;
        let totalWeight = 0;
        
        demands.forEach((demand, index) => {
            const rating = currentAssessment.ratings[demand] || 0;
            const weight = weights[index];
            weightedSum += rating * weight;
            totalWeight += weight;
        });
        
        // Calculate final TLX score
        const tlxScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
        currentAssessment.tlxScore = tlxScore;
        currentAssessment.completedAt = new Date().toISOString();
        
        console.log('TLX Score calculated:', tlxScore);
        console.log('Weights:', weights);
    }
    
    // Helper function to convert display names to internal slugs
    function getSlugFromName(displayName) {
        const mapping = {
            'Mental Demand': 'mentalDemand',
            'Physical Demand': 'physicalDemand', 
            'Temporal Demand': 'temporalDemand',
            'Performance': 'performance',
            'Effort': 'effort',
            'Frustration': 'frustration'
        };
        return mapping[displayName] || displayName.toLowerCase().replace(' ', '');
    }
    
    // Display results in step 4
    function displayResults() {
        const resultsHtml = `
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4>NASA-TLX Score: <span style="color: #007bff; font-size: 1.5em;">${currentAssessment.tlxScore}</span></h4>
                <p><strong>Participant:</strong> ${currentAssessment.participantId}</p>
                <p><strong>Task:</strong> ${currentAssessment.taskDescription}</p>
                <p><strong>Completed:</strong> ${new Date(currentAssessment.completedAt).toLocaleString()}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px;">
                <h5>Individual Ratings:</h5>
                <ul style="text-align: left;">
                    <li>Mental Demand: ${currentAssessment.ratings.mentalDemand || 0}</li>
                    <li>Physical Demand: ${currentAssessment.ratings.physicalDemand || 0}</li>
                    <li>Temporal Demand: ${currentAssessment.ratings.temporalDemand || 0}</li>
                    <li>Performance: ${currentAssessment.ratings.performance || 0}</li>
                    <li>Effort: ${currentAssessment.ratings.effort || 0}</li>
                    <li>Frustration: ${currentAssessment.ratings.frustration || 0}</li>
                </ul>
            </div>
        `;
        
        $('#results_display').html(resultsHtml);
    }
    
    // Calculate TLX score based on ratings and comparisons
    function calculateTLXScore() {
        const demands = ['mentalDemand', 'physicalDemand', 'temporalDemand', 'performance', 'effort', 'frustration'];
        const weights = new Array(6).fill(0);
        
        // Calculate weights from pairwise comparisons
        Object.keys(currentAssessment.comparisons).forEach(pairIndex => {
            const choice = currentAssessment.comparisons[pairIndex];
            const pair = window.comparisonPairs[pairIndex];
            
            if (choice === 0) {
                // First item was selected
                const demandIndex = demands.findIndex(d => d === getSlugFromName(pair[0].name));
                if (demandIndex !== -1) weights[demandIndex]++;
            } else {
                // Second item was selected
                const demandIndex = demands.findIndex(d => d === getSlugFromName(pair[1].name));
                if (demandIndex !== -1) weights[demandIndex]++;
            }
        });
        
        // Calculate weighted score
        let weightedSum = 0;
        let totalWeight = 0;
        
        demands.forEach((demand, index) => {
            const rating = currentAssessment.ratings[demand] || 0;
            const weight = weights[index];
            weightedSum += rating * weight;
            totalWeight += weight;
        });
        
        // Calculate final TLX score
        const tlxScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
        currentAssessment.tlxScore = tlxScore;
        currentAssessment.completedAt = new Date().toISOString();
        
        console.log('TLX Score calculated:', tlxScore);
        console.log('Weights:', weights);
    }
    
    // Helper function to convert display names to internal slugs
    function getSlugFromName(displayName) {
        const mapping = {
            'Mental Demand': 'mentalDemand',
            'Physical Demand': 'physicalDemand', 
            'Temporal Demand': 'temporalDemand',
            'Performance': 'performance',
            'Effort': 'effort',
            'Frustration': 'frustration'
        };
        return mapping[displayName] || displayName.toLowerCase().replace(' ', '');
    }
    
    // Automatic submission function
    window.autoSubmitData = function() {
        setTimeout(async function() {
            try {
                const config = window.RESEARCHER_CONFIG;
                
                if (config.submitMethod === 'email') {
                    await submitViaEmailAuto();
                    
                    // Update UI to show success
                    updateSubmissionStatus('✓ Successfully submitted!', '#28a745', false);
                } else {
                    // For other methods, call the original function
                    await submitToResearcher();
                }
                
            } catch (error) {
                console.error('Auto submission failed:', error);
                updateSubmissionStatus('⚠ Submission failed. Please contact the researcher.', '#dc3545', false);
            }
        }, 2000); // Wait 2 seconds to show the loading state
    };
    
    // Auto email submission (simplified version)
    async function submitViaEmailAuto() {
        const config = window.RESEARCHER_CONFIG;
        const csvData = generateCSV();
        
        // Create subject with participant name in parentheses
        const subjectBase = config.emailTemplate.subjectPrefix || config.studyName;
        const subject = encodeURIComponent(`${subjectBase} (${currentAssessment.participantId})`);
        
        const body = encodeURIComponent(`
Dear Researcher,

Please find the Memento daily usability assessment results below:

=== PARTICIPANT INFORMATION ===
Name: ${currentAssessment.participantId}
Assessment Date: ${currentAssessment.assessmentDate}
Submission Time: ${new Date(currentAssessment.completedAt).toLocaleString()}

=== TASK DETAILS ===
Task: ${currentAssessment.taskDescription}

=== NASA-TLX RESULTS ===
Overall TLX Score: ${currentAssessment.tlxScore}

Individual Ratings (0-100 scale):
• Mental Demand: ${currentAssessment.ratings.mentalDemand || 0}
• Physical Demand: ${currentAssessment.ratings.physicalDemand || 0}
• Temporal Demand: ${currentAssessment.ratings.temporalDemand || 0}
• Performance: ${currentAssessment.ratings.performance || 0}
• Effort: ${currentAssessment.ratings.effort || 0}
• Frustration: ${currentAssessment.ratings.frustration || 0}

=== RAW DATA (CSV FORMAT) ===
${csvData}

---
This response was automatically generated by the ${config.studyName}.
Institution: ${config.institutionName || 'Research Institution'}

Best regards,
${currentAssessment.participantId}
        `.trim());
        
        const mailtoLink = `mailto:${config.email}?subject=${subject}&body=${body}`;
        
        // Open email client automatically
        window.open(mailtoLink);
        
        return true;
    }
    
    // Update submission status UI
    function updateSubmissionStatus(message, color, showSpinner) {
        const statusText = document.getElementById('status_text');
        const spinner = document.getElementById('loading_spinner');
        
        if (statusText) {
            statusText.textContent = message;
            statusText.style.color = color;
        }
        
        if (spinner) {
            spinner.style.display = showSpinner ? 'block' : 'none';
        }
    }
    
});