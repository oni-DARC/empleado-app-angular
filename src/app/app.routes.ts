import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { Error404Component } from './pages/error404/error404.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'empleados', component: EmpleadosComponent }, // ✅ Página pública de empleados
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }, // ✅ Nueva ruta de Login
  { path: '**', component: Error404Component }
];
