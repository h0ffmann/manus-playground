import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EC2State {
  instances: EC2Instance[];
  activeInstance: EC2Instance | null;
  isLoading: boolean;
  error: string | null;
}

export interface EC2Instance {
  id: string;
  instanceId: string;
  status: 'provisioning' | 'running' | 'stopping' | 'terminated' | 'error';
  publicDnsName?: string;
  publicIpAddress?: string;
  region: string;
  launchTime: string;
  lastActivityTime: string;
  instanceType: string;
  healthStatus?: 'healthy' | 'unhealthy';
}

const initialState: EC2State = {
  instances: [],
  activeInstance: null,
  isLoading: false,
  error: null
};

const ec2Slice = createSlice({
  name: 'ec2',
  initialState,
  reducers: {
    fetchInstancesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchInstancesSuccess: (state, action: PayloadAction<EC2Instance[]>) => {
      state.instances = action.payload;
      state.isLoading = false;
    },
    fetchInstancesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    launchInstanceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    launchInstanceSuccess: (state, action: PayloadAction<EC2Instance>) => {
      state.instances.push(action.payload);
      state.activeInstance = action.payload;
      state.isLoading = false;
    },
    launchInstanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    terminateInstanceStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    terminateInstanceSuccess: (state, action: PayloadAction<string>) => {
      state.instances = state.instances.filter(instance => instance.id !== action.payload);
      if (state.activeInstance && state.activeInstance.id === action.payload) {
        state.activeInstance = null;
      }
      state.isLoading = false;
    },
    terminateInstanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setActiveInstance: (state, action: PayloadAction<string>) => {
      const instance = state.instances.find(instance => instance.id === action.payload);
      if (instance) {
        state.activeInstance = instance;
      }
    },
    updateInstanceStatus: (state, action: PayloadAction<{ id: string; status: EC2Instance['status'] }>) => {
      const instance = state.instances.find(instance => instance.id === action.payload.id);
      if (instance) {
        instance.status = action.payload.status;
        if (state.activeInstance && state.activeInstance.id === action.payload.id) {
          state.activeInstance.status = action.payload.status;
        }
      }
    },
    clearEC2Error: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchInstancesStart,
  fetchInstancesSuccess,
  fetchInstancesFailure,
  launchInstanceStart,
  launchInstanceSuccess,
  launchInstanceFailure,
  terminateInstanceStart,
  terminateInstanceSuccess,
  terminateInstanceFailure,
  setActiveInstance,
  updateInstanceStatus,
  clearEC2Error
} = ec2Slice.actions;

export default ec2Slice.reducer;
