import type { Meta, StoryObj } from '@storybook/angular';

import { FormComponent } from './form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { expect } from 'storybook/test';

function createForm(): FormGroup {
  return new FormGroup({
    firstName: new FormControl('', Validators.required),
  });
}

const meta: Meta<FormComponent> = {
  title: 'FormControl',
  component: FormComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  args: {
    form: createForm(),
  },
};

export default meta;
type Story = StoryObj<FormComponent>;

export const Default: Story = {
  args: {
    ...meta.args,
  },
  play: ({ args }) => {
    expect(args.form.touched).toBe(false);
    expect(args.form.dirty).toBe(false);
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    form: createForm(),
  },
  play: ({ args }) => {
    args.form.markAsDirty();
    args.form.markAllAsTouched();
    args.form.updateValueAndValidity();
    expect(args.form.touched).toBe(true);
    expect(args.form.dirty).toBe(true);
  },
};

export const Archived: Story = {
  args: {
    ...Default.args,
    form: createForm(),
  },
};
