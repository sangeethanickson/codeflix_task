'use client';

import { useFormStatus } from 'react-dom';
import { approveLeaveAction } from '../actions';

function Button() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Approving…' : 'Approve'}
    </button>
  );
}

export default function ApproveButton({ id }) {
  return (
    <form action={approveLeaveAction}>
      <input type="hidden" name="id" value={id} />
      <Button />
    </form>
  );
}
