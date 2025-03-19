import { Router } from 'express';
import { EC2InstanceManager } from '../services/ec2InstanceManager';

export function createEC2InstanceRoutes(ec2Manager: EC2InstanceManager) {
  const router = Router();

  // Get all instances for the authenticated user
  router.get('/instances', (req, res) => {
    try {
      const userId = req.user.id;
      const instances = ec2Manager.getUserInstances(userId);
      res.json(instances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific instance
  router.get('/instances/:id', (req, res) => {
    try {
      const instance = ec2Manager.getInstance(req.params.id);
      
      if (!instance) {
        return res.status(404).json({ error: 'Instance not found' });
      }
      
      // Check if the instance belongs to the user
      if (instance.assignedToUserId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(instance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Launch a new instance
  router.post('/instances', async (req, res) => {
    try {
      const userId = req.user.id;
      const { instanceType, region } = req.body;
      
      const instance = await ec2Manager.launchInstance(userId, instanceType, region);
      res.status(201).json(instance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Terminate an instance
  router.delete('/instances/:id', async (req, res) => {
    try {
      const instance = ec2Manager.getInstance(req.params.id);
      
      if (!instance) {
        return res.status(404).json({ error: 'Instance not found' });
      }
      
      // Check if the instance belongs to the user
      if (instance.assignedToUserId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      await ec2Manager.terminateInstance(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Check instance health
  router.get('/instances/:id/health', async (req, res) => {
    try {
      const instance = ec2Manager.getInstance(req.params.id);
      
      if (!instance) {
        return res.status(404).json({ error: 'Instance not found' });
      }
      
      // Check if the instance belongs to the user
      if (instance.assignedToUserId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const isHealthy = await ec2Manager.checkInstanceHealth(req.params.id);
      res.json({ 
        instanceId: req.params.id,
        healthy: isHealthy,
        status: instance.status,
        healthStatus: instance.healthStatus
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
