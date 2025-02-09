import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    const { email, password } = this.loginForm.value;

    if (email === 'diego.a.rogel@example.com' && password === 'admin123') {
      localStorage.setItem('auth', 'true'); // ✅ Guardar autenticación en localStorage
      this.router.navigate(['/administracion']);
    } else {
      alert('Credenciales incorrectas');
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('auth'); // ✅ Eliminar autenticación
    this.router.navigate(['/']); // ✅ Redirigir al Home
  }
}
