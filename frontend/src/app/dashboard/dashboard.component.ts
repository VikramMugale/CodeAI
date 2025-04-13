import { Component, OnInit } from '@angular/core';
import { ReviewService } from 'src/app/core/services/review.service';
import { Submission } from 'src/app/shared/models/submission.model';

interface FeedbackItem {
  line: number;
  severity: string;
  message: string;
  suggestion: string;
}

interface AIFeedbackResponse {
  message: string;
  aiFeedback: FeedbackItem[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  submissions: Submission[] = [];
  selectedSubmission: Submission | null = null;
  loading = false;
  errorMessage = '';
  showModal = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    // Assuming an API like GET /api/submissions for user's history
    // Replace this with your backend's actual endpoint and logic
    fetch('http://localhost:5000/api/submissions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data: Submission[]) => {
        this.submissions = data;
      })
      .catch((error: Error) => {
        console.error('Error fetching submissions:', error);
        this.errorMessage = 'Error loading submissions. Please try again.';
      });
  }

  viewFeedback(submission: Submission): void {
    this.selectedSubmission = submission;
    this.errorMessage = '';
    this.showModal = true;
    
    // Check if AI feedback is already available in the submission
    if (submission.aiFeedback && submission.aiFeedback.length > 0) {
      // Use existing feedback without making a request
      this.loading = false;
      return;
    }
    
    // If no feedback is available, fetch it
    this.loading = true;
    this.reviewService.runCodeReview(submission._id).subscribe({
      next: (response: AIFeedbackResponse) => {
        this.loading = false;
        if (response && response.aiFeedback) {
          // Update the selected submission with the AI feedback
          this.selectedSubmission = {
            ...submission,
            aiFeedback: response.aiFeedback
          };
          
          // Update the submission in the submissions array
          const index = this.submissions.findIndex(s => s._id === submission._id);
          if (index !== -1) {
            this.submissions[index] = this.selectedSubmission;
          }
        } else {
          this.errorMessage = 'No feedback available for this submission.';
        }
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = 'Error loading AI feedback. Please try again.';
        console.error('Error fetching AI feedback:', error);
      }
    });
  }

  closeFeedback(): void {
    this.showModal = false;
    this.selectedSubmission = null;
    this.errorMessage = '';
  }
}
