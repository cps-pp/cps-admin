import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
function NotFound() {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
    const navigate = useNavigate();

>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
<<<<<<< HEAD
      extra={
        <Button
          type="default"
          style={{
            borderColor: '#800080', 
            color: '#800080',
          }}
          onClick={() => navigate('/dashboard')}
        >
=======
       extra={
        <Button type="primary" onClick={() => navigate('/dashboard')}>
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b
          Back Home
        </Button>
      }
    />
  );
}

export default NotFound;
