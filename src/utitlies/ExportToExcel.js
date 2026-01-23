
// import XLSX from 'xlsx';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// import { Alert, Linking } from 'react-native';

// /**
//  * Converts snake_case keys into readable Excel headers
//  */
// const formatHeader = (key) =>
//     key
//         .replace(/_/g, ' ')
//         .replace(/\b(id|gst|qty)\b/gi, m => m.toUpperCase())
//         .replace(/\b\w/g, char => char.toUpperCase());

// export const exportMilkListToExcel = async (milkList) => {
//     try {
//         if (!milkList || milkList.length === 0) {
//             Alert.alert('No data to export');
//             return;
//         }

//         // Extract keys dynamically
//         const keys = Object.keys(milkList[0]);

//         // Calculate total amount
//         const totalAmount = milkList.reduce(
//             (sum, item) => sum + (Number(item.amount) || 0),
//             0
//         );

//         // Transform data with formatted headers
//         const formattedData = milkList.map(item => {
//             const row = {};
//             keys.forEach(key => {
//                 row[formatHeader(key)] = item[key];
//             });
//             return row;
//         });

//         // Create worksheet
//         const worksheet = XLSX.utils.json_to_sheet(formattedData);

//         // Prepare TOTAL row
//         const totalRow = {};
//         const formattedAmountKey = formatHeader('amount');

//         keys.forEach((key, index) => {
//             const header = formatHeader(key);

//             if (header === formattedAmountKey) {
//                 totalRow[header] = `₹ ${totalAmount.toFixed(2)}`;
//             } else if (index === 0) {
//                 totalRow[header] = 'TOTAL';
//             } else {
//                 totalRow[header] = '';
//             }
//         });

//         // Append TOTAL row
//         XLSX.utils.sheet_add_json(worksheet, [totalRow], {
//             skipHeader: true,
//             origin: -1,
//         });

//         // Freeze header row
//         worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

//         // Auto column width
//         worksheet['!cols'] = keys.map(() => ({ wch: 20 }));

//         // Create workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');

//         // Generate Excel file
//         const excelData = XLSX.write(workbook, {
//             type: 'base64',
//             bookType: 'xlsx',
//         });

//         // const filePath =
//         //     RNFS.DownloadDirectoryPath + `/Milk_Report_${Date.now()}.xlsx`;
//         const filePath = `${RNFS.TemporaryDirectoryPath}/Milk_Report_${Date.now()}.xlsx`;

//         // Write file
//         await RNFS.writeFile(filePath, excelData, 'base64');

//         // Success actions
//         Alert.alert(
//             'Export Successful',
//             'Excel file saved in Downloads folder',
//             [
//                 { text: 'OK' },
//                 {
//                     text: 'Open Folder',
//                     onPress: () =>
//                         Linking.openURL(
//                             'content://com.android.externalstorage.documents/document/primary:Download'
//                         ),
//                 },
//                 {
//                     text: 'Share',
//                     onPress: () =>
//                         Share.open({
//                             url: `file://${filePath}`,
//                             type:
//                                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                             filename: 'Milk_Report',
//                         }),
//                 },
//             ]
//         );
//     } catch (error) {
//         console.error('Excel export error:', error);
//         Alert.alert('Export Failed', 'Something went wrong while exporting');
//     }
// };

import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert, Platform } from 'react-native';

const formatHeader = (key) =>
    key
        .replace(/_/g, ' ')
        .replace(/\b(id|gst|qty)\b/gi, m => m.toUpperCase())
        .replace(/\b\w/g, char => char.toUpperCase());

export const exportMilkListToExcel = async (milkList) => {
    try {
        if (!milkList || milkList.length === 0) {
            Alert.alert('No data to export');
            return;
        }

        const keys = Object.keys(milkList[0]);

        // 1. CALCULATE BOTH TOTALS
        const totalAmount = milkList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalLiters = milkList.reduce((sum, item) => sum + (Number(item.liter) || 0), 0);

        // 2. TRANSFORM DATA ROWS
        const formattedData = milkList.map(item => {
            const row = {};
            keys.forEach(key => {
                row[formatHeader(key)] = item[key];
            });
            return row;
        });

        // 3. CREATE WORKSHEET
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // 4. CREATE THE TOTAL ROW (Aligned with columns)
        const totalRow = {};
        const amountColName = formatHeader('amount');
        const literColName = formatHeader('liter');

        keys.forEach((key, index) => {
            const header = formatHeader(key);
            if (header === amountColName) {
                totalRow[header] = `₹ ${totalAmount.toFixed(2)}`; // Set Total Amount
            } else if (header === literColName) {
                totalRow[header] = `${totalLiters.toFixed(2)} L`; // Set Total Milk Liter
            } else if (index === 0) {
                totalRow[header] = 'TOTAL SUMMARY'; // Label for the first column
            } else {
                totalRow[header] = ''; // Keep other columns empty
            }
        });

        // 5. APPEND TOTAL ROW TO SHEET
        XLSX.utils.sheet_add_json(worksheet, [totalRow], {
            skipHeader: true,
            origin: -1, // Adds to the very end
        });

        // Column width & Freeze header
        worksheet['!cols'] = keys.map(() => ({ wch: 20 }));
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');

        const excelData = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        
        // 2026 Play Store compliant path
        const filePath = `${RNFS.CachesDirectoryPath}/Milk_Report_${Date.now()}.xlsx`;
        await RNFS.writeFile(filePath, excelData, 'base64');

        Alert.alert('Success', 'Total Amount and Total Liters have been calculated.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Share / Save',
                onPress: () => Share.open({
                    url: `file://${filePath}`,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    saveToFiles: true,
                }),
            },
        ]);
    } catch (error) {
        console.error('Excel export error:', error);
        Alert.alert('Export Failed', 'Please check if your list has "amount" and "liter" keys.');
    }
};