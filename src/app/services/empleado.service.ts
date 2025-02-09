import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
  id?: number;
  nombre: string;
  correo: string;
  puesto: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/empleados'; // 📌 JSON Server URL

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  addEmpleado(empleado: Empleado): Observable<Empleado> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Empleado>(this.apiUrl, empleado, { headers });
  }

  editEmpleado(empleado: Empleado): Observable<Empleado> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Empleado>(`${this.apiUrl}/${empleado.id}`, empleado, { headers });
  }

  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
