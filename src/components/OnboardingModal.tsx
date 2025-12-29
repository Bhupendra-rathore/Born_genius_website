import { useState } from 'react';
import { createProfile } from '../services/profileService';
import { setPassword } from '../services/authService';

export const OnboardingModal = ({ onDone }: { onDone: () => void }) => {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPasswordValue] = useState('');

  const submit = async () => {
    await createProfile({
      parent_name: parentName,
      child_name: childName,
      child_age: Number(childAge),
      phone,
    });

    if (password) {
      await setPassword(password);
    }

    onDone();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Welcome to Born Genius</h2>

        <input className="input" placeholder="Parent name" onChange={e => setParentName(e.target.value)} />
        <input className="input" placeholder="Child name" onChange={e => setChildName(e.target.value)} />
        <input className="input" type="number" placeholder="Child age" onChange={e => setChildAge(e.target.value)} />
        <input className="input" placeholder="Phone (optional)" onChange={e => setPhone(e.target.value)} />
        <input className="input" type="password" placeholder="Set password" onChange={e => setPasswordValue(e.target.value)} />

        <button onClick={submit} className="btn-primary w-full mt-4">
          Continue
        </button>
      </div>
    </div>
  );
};
