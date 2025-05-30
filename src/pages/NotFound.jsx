import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="default"
          style={{
            borderColor: '#800080', 
            color: '#800080',
          }}
          onClick={() => navigate('/dashboard')}
        >
          Back Home
        </Button>
      }
    />
  );
}

export default NotFound;
