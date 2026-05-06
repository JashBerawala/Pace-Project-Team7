import { configureStore, createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
  name: 'events',
  initialState: { list: [], loading: false, error: null, current: null },
  reducers: {
    setEvents: (state, action) => { state.list = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setCurrent: (state, action) => { state.current = action.payload; },
    addEvent: (state, action) => { state.list.unshift(action.payload); },
    removeEvent: (state, action) => {
      state.list = state.list.filter(e => e._id !== action.payload);
    },
    updateEvent: (state, action) => {
      const idx = state.list.findIndex(e => e._id === action.payload._id);
      if (idx !== -1) state.list[idx] = action.payload;
    }
  }
});

const photosSlice = createSlice({
  name: 'photos',
  initialState: { list: [], loading: false, uploading: false, uploadProgress: 0 },
  reducers: {
    setPhotos: (state, action) => { state.list = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setUploading: (state, action) => { state.uploading = action.payload; },
    setProgress: (state, action) => { state.uploadProgress = action.payload; },
    addPhotos: (state, action) => { state.list = [...action.payload, ...state.list]; },
    updatePhotoStatus: (state, action) => {
      const { photoId, status, faceCount } = action.payload;
      const photo = state.list.find(p => p._id === photoId);
      if (photo) {
        photo.status = status;
        if (faceCount !== undefined) photo.faceCount = faceCount;
      }
    },
    removePhoto: (state, action) => {
      state.list = state.list.filter(p => p._id !== action.payload);
    }
  }
});

const matchSlice = createSlice({
  name: 'match',
  initialState: { results: [], loading: false, error: null, searched: false },
  reducers: {
    setResults: (state, action) => { state.results = action.payload; state.searched = true; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.searched = true; },
    reset: (state) => { state.results = []; state.loading = false; state.error = null; state.searched = false; }
  }
});

export const eventsActions = eventsSlice.actions;
export const photosActions = photosSlice.actions;
export const matchActions = matchSlice.actions;

export const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
    photos: photosSlice.reducer,
    match: matchSlice.reducer
  }
});
