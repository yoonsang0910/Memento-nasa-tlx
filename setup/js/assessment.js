/* Memento Daily Usability Assessment - Main JavaScript */

// Global variables for the enhanced NASA-TLX
let currentAssessment = {
	participantId: '',
	taskDescription: '',
	timestamp: '',
	ratings: {},
	comparisons: {},
	tlxScore: 0,
	completedAt: ''
};

let savedFileInfo = null;
let emailWindowOpened = false;

// Start assessment function
function startAssessment() {
	const participantName = document.getElementById('participant_id').value.trim();
	const assessmentDate = document.getElementById('assessment_date').value.trim();
	
	if (!participantName) {
		alert('Please enter your name before starting the assessment.');
		return;
	}
	
	if (!assessmentDate) {
		alert('Please select the date when you completed the task.');
		return;
	}
	
	currentAssessment.participantId = participantName;
	currentAssessment.taskDescription = `Memento system usage on ${assessmentDate}`;
	currentAssessment.assessmentDate = assessmentDate;
	currentAssessment.timestamp = new Date().toISOString();
	
	// Update display
	document.getElementById('display_participant_id').textContent = participantName;
	document.getElementById('display_task_description').textContent = currentAssessment.taskDescription;
	document.getElementById('display_timestamp').textContent = new Date().toLocaleString();
	
	// Show step 1
	document.querySelector('.step_welcome').style.display = 'none';
	document.querySelector('.step_1').style.display = 'block';
}

// Navigation functions
function goBackToWelcome() {
	document.querySelector('.step_1').style.display = 'none';
	document.querySelector('.step_welcome').style.display = 'block';
}

function goToStep1() {
	document.querySelector('.step_2').style.display = 'none';
	document.querySelector('.step_1').style.display = 'block';
}

function goToStep2() {
	document.querySelector('.step_3').style.display = 'none';
	document.querySelector('.step_2').style.display = 'block';
}

// Start rating questions (called from HTML)
function startRatingQuestions() {
	document.querySelector('.step_1').style.display = 'none';
	document.querySelector('.step_2').style.display = 'block';
	// The enhanced.js will handle the initialization
}

// Data export functions
function downloadResults() {
	const csvContent = generateCSV();
	const blob = new Blob([csvContent], { type: 'text/csv' });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `memento_${currentAssessment.participantId}_${new Date().toISOString().split('T')[0]}.csv`;
	a.click();
	window.URL.revokeObjectURL(url);
}

function generateCSV() {
	const headers = [
		'ParticipantName', 'AssessmentDate', 'TaskDescription', 'Timestamp', 'CompletedAt',
		'MentalDemand_Original', 'PhysicalDemand_Original', 'TemporalDemand_Original', 'Performance_Original', 'Effort_Original', 'Frustration_Original',
		'MentalDemand_Weighted', 'PhysicalDemand_Weighted', 'TemporalDemand_Weighted', 'Performance_Weighted', 'Effort_Weighted', 'Frustration_Weighted',
		'TLX_Score_Weighted'
	];
	
	const values = [
		currentAssessment.participantId,
		currentAssessment.assessmentDate || '',
		currentAssessment.taskDescription,
		currentAssessment.timestamp,
		currentAssessment.completedAt,
		// Original scores
		currentAssessment.ratings.mentalDemand || 0,
		currentAssessment.ratings.physicalDemand || 0,
		currentAssessment.ratings.temporalDemand || 0,
		currentAssessment.ratings.performance || 0,
		currentAssessment.ratings.effort || 0,
		currentAssessment.ratings.frustration || 0,
		// Weighted scores
		currentAssessment.weightedRatings?.mentalDemand || 0,
		currentAssessment.weightedRatings?.physicalDemand || 0,
		currentAssessment.weightedRatings?.temporalDemand || 0,
		currentAssessment.weightedRatings?.performance || 0,
		currentAssessment.weightedRatings?.effort || 0,
		currentAssessment.weightedRatings?.frustration || 0,
		currentAssessment.tlxScore || 0
	];
	
	return headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',');
}

// Store data in localStorage for backup
function saveToLocalStorage() {
	try {
		const allData = JSON.parse(localStorage.getItem('nasa_tlx_data') || '[]');
		allData.push(currentAssessment);
		localStorage.setItem('nasa_tlx_data', JSON.stringify(allData));
	} catch (e) {
		console.log('Could not save to localStorage:', e);
	}
}

// Function to save CSV file and enable email button
async function saveCSVFile() {
	try {
		const statusDiv = document.getElementById('save_status');
		const emailBtn = document.getElementById('send_email_btn');
		const attachInstruction = document.getElementById('attach_instruction');
		
		statusDiv.innerHTML = '<span style="color: #007bff;">💾 Preparing download...</span>';
		
		// Download the CSV file
		downloadResults();
		
		// Enable email button after download starts
		setTimeout(() => {
			statusDiv.innerHTML = '<span style="color: #28a745;">✅ CSV file download started! Save the file to your computer.</span>';
			
			// Enable the email button (if not already enabled)
			if (emailBtn.disabled) {
				emailBtn.disabled = false;
				emailBtn.style.opacity = '1';
				
				// Show attachment instruction
				attachInstruction.style.display = 'block';
			}
			
		}, 1000);
		
	} catch (error) {
		const statusDiv = document.getElementById('save_status');
		statusDiv.innerHTML = '<span style="color: #dc3545;">❌ Error occurred. Please try again.</span>';
	}
}

// Proceed to email (called when Send Email button is clicked)
function proceedToEmail() {
	const emailStatus = document.getElementById('save_status');
	emailStatus.innerHTML = '<span style="color: #007bff;">📧 Opening Gmail...</span>';
	
	// Mark that email window was opened
	emailWindowOpened = true;
	
	// Open Gmail
	submitViaGmail();
	
	// Update status with closing instructions
	setTimeout(() => {
		emailStatus.innerHTML = '<span style="color: #007bff;">📧 Gmail opened! After sending the email, you can close the Gmail tab and return here.</span>';
	}, 1000);
}

// Submit via Gmail web interface (simplified)
async function submitViaGmail() {
	const config = window.RESEARCHER_CONFIG || { studyName: 'Memento Daily Usability Assessment', email: 'researcher@example.com' };
	
	// Format the assessment date for the subject
	const assessmentDate = currentAssessment.assessmentDate || new Date().toISOString().split('T')[0];
	const formattedDate = new Date(assessmentDate).toLocaleDateString('en-US', { 
		month: 'numeric', 
		day: 'numeric', 
		year: 'numeric' 
	});
	
	const subject = encodeURIComponent(`${config.studyName} - ${currentAssessment.participantId} (${formattedDate})`);
	const body = encodeURIComponent(`Participant: ${currentAssessment.participantId}

Please find the assessment results in the attached CSV file.

AFTER SENDING: You can close this Gmail tab and return to the study page.`);
	
	const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.email)}&su=${subject}&body=${body}`;
	window.open(gmailUrl, '_blank');
	
	return true;
}
