import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  launchInstanceStart, 
  terminateInstanceStart, 
  setActiveInstance 
} from '../../store/ec2Slice';
import { addNotification } from '../../store/uiSlice';
import './EC2InstanceManager.css';

const EC2InstanceManager: React.FC = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [instanceType, setInstanceType] = useState('t2.medium');
  const [region, setRegion] = useState('us-east-1');
  
  const dispatch = useDispatch();
  const { instances, activeInstance, isLoading } = useSelector((state: RootState) => state.ec2);

  const handleLaunchInstance = () => {
    setIsLaunching(true);
    
    // In a real app, this would dispatch an action that makes an API call
    // For now, we'll just simulate the launch
    dispatch(launchInstanceStart());
    
    // Simulate API call to launch EC2 instance
    setTimeout(() => {
      const newInstance = {
        id: `inst-${Date.now()}`,
        instanceId: `i-${Math.random().toString(36).substring(2, 10)}`,
        status: 'running' as const,
        region,
        publicDnsName: `ec2-${Math.random().toString(36).substring(2, 10)}.${region}.compute.amazonaws.com`,
        publicIpAddress: `54.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        launchTime: new Date().toISOString(),
        lastActivityTime: new Date().toISOString(),
        instanceType,
        healthStatus: 'healthy' as const
      };
      
      // This would be handled by a saga or thunk in a real app
      dispatch({ type: 'ec2/launchInstanceSuccess', payload: newInstance });
      
      dispatch(addNotification({
        type: 'success',
        message: `Successfully launched EC2 instance ${newInstance.instanceId}`,
        autoClose: true,
        duration: 5000
      }));
      
      setIsLaunching(false);
    }, 2000);
  };

  const handleTerminateInstance = (instanceId: string) => {
    if (window.confirm(`Are you sure you want to terminate instance ${instanceId}?`)) {
      dispatch(terminateInstanceStart(instanceId));
      
      // Simulate API call to terminate EC2 instance
      setTimeout(() => {
        // This would be handled by a saga or thunk in a real app
        dispatch({ type: 'ec2/terminateInstanceSuccess', payload: instanceId });
        
        dispatch(addNotification({
          type: 'info',
          message: `Terminated EC2 instance ${instanceId}`,
          autoClose: true,
          duration: 5000
        }));
      }, 1500);
    }
  };

  const handleSetActiveInstance = (instanceId: string) => {
    dispatch(setActiveInstance(instanceId));
    
    dispatch(addNotification({
      type: 'info',
      message: `Switched to EC2 instance ${instanceId}`,
      autoClose: true,
      duration: 3000
    }));
  };

  return (
    <div className="ec2-instance-manager">
      <div className="instance-manager-header">
        <h2>EC2 Instance Manager</h2>
        <button 
          className="btn btn-primary"
          onClick={handleLaunchInstance}
          disabled={isLaunching || isLoading}
        >
          {isLaunching ? 'Launching...' : 'Launch New Instance'}
        </button>
      </div>
      
      {isLaunching && (
        <div className="launch-options">
          <div className="form-group">
            <label htmlFor="instanceType">Instance Type</label>
            <select 
              id="instanceType" 
              className="form-control"
              value={instanceType}
              onChange={(e) => setInstanceType(e.target.value)}
            >
              <option value="t2.micro">t2.micro (1 vCPU, 1 GiB RAM)</option>
              <option value="t2.small">t2.small (1 vCPU, 2 GiB RAM)</option>
              <option value="t2.medium">t2.medium (2 vCPU, 4 GiB RAM)</option>
              <option value="t2.large">t2.large (2 vCPU, 8 GiB RAM)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select 
              id="region" 
              className="form-control"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-east-2">US East (Ohio)</option>
              <option value="us-west-1">US West (N. California)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">EU (Ireland)</option>
              <option value="eu-central-1">EU (Frankfurt)</option>
              <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="instances-list">
        {instances.length === 0 ? (
          <div className="no-instances">
            <p>No EC2 instances available</p>
            <p>Launch a new instance to get started</p>
          </div>
        ) : (
          <table className="instances-table">
            <thead>
              <tr>
                <th>Instance ID</th>
                <th>Status</th>
                <th>Type</th>
                <th>Region</th>
                <th>Public IP</th>
                <th>Launch Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instances.map(instance => (
                <tr 
                  key={instance.id} 
                  className={activeInstance?.id === instance.id ? 'active-instance' : ''}
                >
                  <td>{instance.instanceId}</td>
                  <td>
                    <span className={`status-indicator status-${instance.status}`}>
                      {instance.status}
                    </span>
                  </td>
                  <td>{instance.instanceType}</td>
                  <td>{instance.region}</td>
                  <td>{instance.publicIpAddress || '-'}</td>
                  <td>{new Date(instance.launchTime).toLocaleString()}</td>
                  <td className="instance-actions">
                    {instance.status === 'running' && (
                      <>
                        <button 
                          className="btn-sm btn-primary"
                          onClick={() => handleSetActiveInstance(instance.id)}
                          disabled={activeInstance?.id === instance.id}
                        >
                          {activeInstance?.id === instance.id ? 'Active' : 'Use'}
                        </button>
                        <button 
                          className="btn-sm btn-danger"
                          onClick={() => handleTerminateInstance(instance.id)}
                        >
                          Terminate
                        </button>
                      </>
                    )}
                    {instance.status !== 'running' && (
                      <span className="status-text">{instance.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EC2InstanceManager;
