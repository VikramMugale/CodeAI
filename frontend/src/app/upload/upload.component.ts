import { Component } from '@angular/core';
import { UploadService } from 'src/app/core/services/upload.service';
import { ReviewService } from 'src/app/core/services/review.service';

interface FeedbackItem {
  line: number;
  severity: string;
  message: string;
  suggestion: string;
}

interface UploadResponse {
  message: string;
  submissionId: string;
  filename: string;
}

interface AIFeedbackResponse {
  message: string;
  aiFeedback: FeedbackItem[];
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadMessage = '';
  loading = false;
  uploading = false;
  errorMessage = '';
  aiFeedback: FeedbackItem[] = [];
  submissionId: string | null = null;

  constructor(
    private uploadService: UploadService,
    private reviewService: ReviewService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadMessage = `File selected: ${this.selectedFile.name}`;
      this.errorMessage = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first.';
      return;
    }

    this.uploading = true;
    this.errorMessage = '';
    this.aiFeedback = [];
    this.submissionId = null;

    this.uploadService.uploadCodeFile(this.selectedFile).subscribe({
      next: (response: UploadResponse) => {
        this.uploading = false;
        this.uploadMessage = response.message;
        this.submissionId = response.submissionId;
        
        // Get AI feedback after successful upload
        if (this.submissionId) {
          this.getAIFeedback(this.submissionId);
        }
      },
      error: (error: Error) => {
        this.uploading = false;
        this.errorMessage = 'Error uploading file. Please try again.';
        console.error('Upload error:', error);
      }
    });
  }

  private getAIFeedback(submissionId: string): void {
    this.loading = true;
    this.reviewService.runCodeReview(submissionId).subscribe({
      next: (response: AIFeedbackResponse) => {
        this.loading = false;
        if (response && response.aiFeedback) {
          this.aiFeedback = response.aiFeedback;
          this.uploadMessage = response.message;
        } else {
          this.errorMessage = 'No feedback received from AI analysis.';
        }
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = 'Error getting AI feedback. Please try again.';
        console.error('AI feedback error:', error);
      }
    });
  }
}
