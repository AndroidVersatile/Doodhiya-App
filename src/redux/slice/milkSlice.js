import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import {
    addMilkEntry,
    updateMilkEntry,
    deleteMilkEntry,
    fetchMilkEntries,
} from '../../services/milkServices';

/* =========================
   CREATE MILK ENTRY
========================= */
export const createMilk = createAsyncThunk(
    'milk/create',
    async ({ uid, milk }, thunkAPI) => {
        try {
            const createdMilk = await addMilkEntry({ uid, milk });

            Toast.show({
                type: 'success',
                text1: 'Milk Entry Added',
                text2: 'Milk entry saved successfully',
            });

            return createdMilk;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Milk Entry Failed',
                text2: error.message || 'Unable to add milk entry',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/* =========================
   FETCH MILK ENTRIES
========================= */
export const getMilkEntries = createAsyncThunk(
    'milk/fetch',
    async ({ uid }, thunkAPI) => {
        try {
            return await fetchMilkEntries({ uid });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Load Failed',
                text2: 'Unable to fetch milk entries',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/* =========================
   UPDATE MILK ENTRY
========================= */
export const editMilk = createAsyncThunk(
    'milk/update',
    async ({ uid, milkId, updates }, thunkAPI) => {
        try {
            const result = await updateMilkEntry({ uid, milkId, updates });

            Toast.show({
                type: 'success',
                text1: 'Milk Entry Updated',
            });

            return result;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Unable to update milk entry',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/* =========================
   DELETE MILK ENTRY
========================= */
export const removeMilk = createAsyncThunk(
    'milk/delete',
    async ({ uid, milkId }, thunkAPI) => {
        try {
            await deleteMilkEntry({ uid, milkId });

            Toast.show({
                type: 'success',
                text1: 'Milk Entry Deleted',
            });

            return milkId;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Unable to delete milk entry',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/* =========================
   SLICE
========================= */
const milkSlice = createSlice({
    name: 'milk',
    initialState: {
        milkList: [],
        addMilkLoading: false,
        fetchMilkLoading: false,
        updateMilkLoading: false,
        deleteMilkLoading: false,
        milkError: null
    },
    reducers: {
        clearMilkByCustomer: (state, action) => {
            const customerId = action.payload;
            state.milkList = state.milkList.filter(
                milk => milk.customerId !== customerId
            );
        },
    },

    extraReducers: (builder) => {
        builder
            /* CREATE */
            .addCase(createMilk.pending, (state, action) => {
                state.addMilkLoading = true;
                state.milkError = null
            })
            .addCase(createMilk.fulfilled, (state, action) => {
                state.milkList.unshift(action.payload);
                state.addMilkLoading = false;
            })
            .addCase(createMilk.rejected, (state, action) => {
                state.addMilkLoading = false;
                state.milkError = action.payload
            })

            /* FETCH */
            .addCase(getMilkEntries.pending, (state, action) => {
                state.fetchMilkLoading = true;
                state.milkError = null
            })
            .addCase(getMilkEntries.fulfilled, (state, action) => {
                state.milkList = action.payload;
                state.fetchMilkLoading = false;

            })
            .addCase(getMilkEntries.rejected, (state, action) => {
                state.fetchMilkLoading = false;
                state.milkError = action.payload
            })

            /* UPDATE */
            .addCase(editMilk.pending, (state, action) => {
                state.updateMilkLoading = true;
                state.milkError = null;

            })
            .addCase(editMilk.fulfilled, (state, action) => {
                const { milkId, updates } = action.payload;
                const index = state.milkList.findIndex(m => m.id === milkId);
                if (index !== -1) {
                    state.milkList[index] = {
                        ...state.milkList[index],
                        ...updates,
                    };
                }
                state.updateMilkLoading = false;
            })
            .addCase(editMilk.rejected, (state, action) => {
                state.updateMilkLoading = false;
                state.milkError = action.payload;

            })
            /* DELETE */
            .addCase(removeMilk.pending, (state, action) => {
                state.milkError = null;
                state.deleteMilkLoading = true
            })
            .addCase(removeMilk.fulfilled, (state, action) => {
                state.milkList = state.milkList.filter(
                    m => m.id !== action.payload
                );
                state.deleteMilkLoading = false
            })
            .addCase(removeMilk.rejected, (state, action) => {
                state.milkError = action.payload;
                state.deleteMilkLoading = false
            });
    },
});

export const { clearMilkByCustomer } = milkSlice.actions;
export default milkSlice.reducer;
