import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isNavbarCollapsed = true;
  private bsCollapse: any;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize state
    this.isNavbarCollapsed = true;
  }

  ngAfterViewInit(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      // Initialize Bootstrap collapse
      const navbarContent = document.querySelector('#navbarSupportedContent');
      
      if (navbarContent) {
        // Create Bootstrap collapse instance
        this.bsCollapse = new bootstrap.Collapse(navbarContent, {
          toggle: false
        });
        
        // Ensure it's collapsed initially
        if (this.isNavbarCollapsed) {
          this.bsCollapse.hide();
        }
      }
    }, 0);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    
    if (this.bsCollapse) {
      if (this.isNavbarCollapsed) {
        this.bsCollapse.hide();
      } else {
        this.bsCollapse.show();
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
