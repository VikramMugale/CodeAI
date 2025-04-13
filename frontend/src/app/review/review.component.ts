import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/core/services/review.service';
import { Submission } from 'src/app/shared/models/submission.model';

interface FeedbackItem {
  line: number;
  severity: string;
  message: string;
  suggestion: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  submissionId!: string;
  submission: Submission | null = null;
  errorMessage = '';
  loading = true;
  aiFeedback: FeedbackItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.submissionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.submissionId) {
      this.fetchSubmission();
    } else {
      this.errorMessage = 'No submission ID provided.';
      this.loading = false;
    }
  }

  fetchSubmission(): void {
    this.reviewService.getSubmissionById(this.submissionId).subscribe({
      next: (data) => {
        this.submission = data;
        this.loading = false;
        
        // Run code review after fetching submission
        this.runCodeReview();
      },
      error: () => {
        this.errorMessage = 'Error fetching submission.';
        this.loading = false;
      },
    });
  }
  
  runCodeReview(): void {
    this.loading = true;
    this.reviewService.runCodeReview(this.submissionId).subscribe({
      next: (response) => {
        if (response && response.aiFeedback) {
          this.aiFeedback = response.aiFeedback;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error running code review.';
        this.loading = false;
      },
    });
  }
}
