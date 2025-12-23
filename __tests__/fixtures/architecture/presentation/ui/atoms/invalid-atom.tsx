// Invalid: atom importing navigation
import { navigate } from '../../../navigation/router';

export function LinkButton({ label }: { label: string }) {
  const handleClick = () => navigate('/home');
  return <button onClick={handleClick}>{label}</button>;
}
