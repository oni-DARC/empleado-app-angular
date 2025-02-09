import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpleadoService, Empleado } from '../../services/empleado.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AdministracionComponent implements OnInit, AfterViewInit {
  empleados: Empleado[] = [];
  empleadoForm!: FormGroup;
  editando: boolean = false;
  bootstrap: any;
  modalInstance: any;

  @ViewChild('modalEmpleado', { static: false }) modalEmpleado!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerEmpleados();
  }

  async ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      const bootstrapModule = await import('bootstrap');
      this.bootstrap = bootstrapModule;
    }
  }

  inicializarFormulario() {
    this.empleadoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      puesto: ['', Validators.required]
    });
  }

  obtenerEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: (err) => console.error('❌ Error obteniendo empleados', err)
    });
  }

  abrirModalAgregar(): void {
    this.editando = false;
    this.empleadoForm.reset();
    this.abrirModal();
  }

  abrirModalEditar(empleado: Empleado): void {
    if (!this.modalEmpleado) {
      console.error('❌ Error: modalEmpleado no está definido.');
      return;
    }

    this.editando = true;
    this.empleadoForm.patchValue(empleado);
    this.abrirModal();
  }

  abrirModal(): void {
    if (!this.modalEmpleado) {
      console.error('❌ Error: No se encontró el modal.');
      return;
    }

    if (this.bootstrap) {
      this.modalInstance = new this.bootstrap.Modal(this.modalEmpleado.nativeElement);
      this.modalInstance.show();
    }
  }

  cerrarModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarEmpleado(): void {
    if (this.empleadoForm.invalid) {
      console.warn('⚠️ Formulario inválido. Verifica los campos.');
      return;
    }

    let empleado: Empleado = this.empleadoForm.value;

    if (this.editando) {
      if (!empleado.id) {
        console.error('❌ Error: El ID es undefined al intentar actualizar.');
        return;
      }
      this.empleadoService.editEmpleado(empleado).subscribe({
        next: () => {
          console.log('✅ Empleado actualizado con éxito');
          this.obtenerEmpleados();
          this.cerrarModal();
        },
        error: (err) => console.error('❌ Error al actualizar empleado', err)
      });
    } else {
      delete empleado.id;
      this.empleadoService.addEmpleado(empleado).subscribe({
        next: (response) => {
          console.log('✅ Empleado agregado con éxito', response);
          this.obtenerEmpleados();
          this.cerrarModal();
        },
        error: (err) => console.error('❌ Error al agregar empleado', err)
      });
    }
  }

  eliminarEmpleado(id?: number): void {
    if (!id) {
      console.error('❌ Error: El ID es undefined al intentar eliminar.');
      return;
    }

    if (confirm('❗ ¿Seguro que quieres eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(id).subscribe({
        next: () => {
          console.log('✅ Empleado eliminado con éxito');
          this.obtenerEmpleados();
        },
        error: (err) => console.error('❌ Error al eliminar empleado', err)
      });
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/']);
  }
}
