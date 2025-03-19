import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BrowserState {
  currentUrl: string | null;
  isLoading: boolean;
  screenshot: string | null;
  content: string | null;
  error: string | null;
  history: string[];
  elements: BrowserElement[];
}

interface BrowserElement {
  id: number;
  tag: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const initialState: BrowserState = {
  currentUrl: null,
  isLoading: false,
  screenshot: null,
  content: null,
  error: null,
  history: [],
  elements: []
};

const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    navigateStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    navigateSuccess: (state, action: PayloadAction<{ url: string; content: string; screenshot: string; elements: BrowserElement[] }>) => {
      state.currentUrl = action.payload.url;
      state.content = action.payload.content;
      state.screenshot = action.payload.screenshot;
      state.elements = action.payload.elements;
      state.isLoading = false;
      if (state.currentUrl && !state.history.includes(state.currentUrl)) {
        state.history.push(state.currentUrl);
      }
    },
    navigateFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clickElementStart: (state, action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    clickElementSuccess: (state, action: PayloadAction<{ content: string; screenshot: string; elements: BrowserElement[] }>) => {
      state.content = action.payload.content;
      state.screenshot = action.payload.screenshot;
      state.elements = action.payload.elements;
      state.isLoading = false;
    },
    clickElementFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    typeTextStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    typeTextSuccess: (state, action: PayloadAction<{ content: string; screenshot: string; elements: BrowserElement[] }>) => {
      state.content = action.payload.content;
      state.screenshot = action.payload.screenshot;
      state.elements = action.payload.elements;
      state.isLoading = false;
    },
    typeTextFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearBrowserState: (state) => {
      state.currentUrl = null;
      state.content = null;
      state.screenshot = null;
      state.elements = [];
      state.error = null;
      state.history = [];
    }
  }
});

export const {
  navigateStart,
  navigateSuccess,
  navigateFailure,
  clickElementStart,
  clickElementSuccess,
  clickElementFailure,
  typeTextStart,
  typeTextSuccess,
  typeTextFailure,
  clearBrowserState
} = browserSlice.actions;

export default browserSlice.reducer;
