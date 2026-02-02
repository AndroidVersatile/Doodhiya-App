import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { addCustomer, deleteCustomer, getCustomers, updateCustomer } from '../../services/customerServices';
import { deleteMilkEntriesByCustomer } from '../../services/milkServices';
import { clearMilkByCustomer } from './milkSlice';

export const createCustomer = createAsyncThunk(
    'customer/create',
    async ({ uid, customer }, thunkAPI) => {
        
        // console.log('Customer payload in thunk', uid, customer);
        try {
            const createdCustomer = await addCustomer({ uid, customer });

            Toast.show({
                type: 'success',
                text1: 'Customer Added',
                text2: `Customer Name: ${customer.name}`,
            });

            return createdCustomer
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Customer Error',
                text2: 'Unable to create customer',
            });
            // console.log('Error', error.message);

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const fetchCustomers = createAsyncThunk(
    'customer/fetchAll',
    async ({uid}, thunkAPI) => {
        try {
            const customers = await getCustomers({uid});
            return customers;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Load Failed',
                text2: 'Unable to fetch customers',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const updateCustomerThunk = createAsyncThunk(
    'customer/update',
    async ({ uid, customerId, updates }, thunkAPI) => {
        try {
            const result = await updateCustomer({ uid, customerId, updates });

            Toast.show({
                type: 'success',
                text1: 'Customer Updated',
            });

            return result;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Unable to update customer',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const deleteCustomerThunk = createAsyncThunk(
    'customer/delete',
    async ({ uid, customerId }, thunkAPI) => {
        try {
            await deleteCustomer({ uid, customerId });
            await deleteMilkEntriesByCustomer({ uid, customerId });

            thunkAPI.dispatch(clearMilkByCustomer(customerId));

            Toast.show({
                type: 'success',
                text1: 'Customer Deleted',
            });

            return customerId;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Unable to delete customer',
            });

            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customersList: [],
        addLoading: false,
        updateLoading: false,
        deleteLoading: false,
        fetchLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* =====================
               CREATE
            ===================== */
            .addCase(createCustomer.pending, (state) => {
                state.addLoading = true;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.customersList.unshift(action.payload);
                state.addLoading = false;
            })
            .addCase(createCustomer.rejected, (state) => {
                state.addLoading = false;
            })

            /* =====================
               UPDATE
            ===================== */
            .addCase(updateCustomerThunk.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateCustomerThunk.fulfilled, (state, action) => {
                const { customerId, updates } = action.payload;

                const index = state.customersList.findIndex(
                    (c) => c.id === customerId
                );

                if (index !== -1) {
                    state.customersList[index] = {
                        ...state.customersList[index],
                        ...updates,
                    };
                }

                state.updateLoading = false;
            })
            .addCase(updateCustomerThunk.rejected, (state) => {
                state.updateLoading = false;
            })

            /* =====================
               DELETE
            ===================== */
            .addCase(deleteCustomerThunk.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
                state.customersList = state.customersList.filter(
                    (c) => c.id !== action.payload
                );
                state.deleteLoading = false;
            })
            .addCase(deleteCustomerThunk.rejected, (state) => {
                state.deleteLoading = false;
            })

            ///Fetch Customers

            .addCase(fetchCustomers.pending, (state) => {
                state.fetchLoading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.customersList = action.payload;
                state.fetchLoading = false;
            })
            .addCase(fetchCustomers.rejected, (state) => {
                state.fetchLoading = false;
            });
    },
});

export default customerSlice.reducer;



