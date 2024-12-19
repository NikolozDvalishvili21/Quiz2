import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  productForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    @Optional() public dialogRef: MatDialogRef<ProductFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Partial<Product>
  ) {
    this.isEditMode = !!data?.id;
    this.productForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      description: [data?.description || '', [Validators.required]],
      price: [data?.price || '', [Validators.required, Validators.min(0)]],
      createdAt: [
        data?.createdAt ? new Date(data.createdAt) : new Date(),
        [Validators.required],
      ],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value;

      if (this.isEditMode && this.data?.id) {
        this.productService
          .updateProduct(this.data.id, product)
          .subscribe(() => {
            if (this.dialogRef) {
              this.dialogRef.close(true);
            }
          });
      } else {
        this.productService.createProduct(product).subscribe(() => {
          if (this.dialogRef) {
            this.dialogRef.close(true);
          }
        });
      }
    }
  }
}
