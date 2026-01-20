
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert, Linking } from 'react-native';

/**
 * Converts snake_case keys into readable Excel headers
 */
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

        // Extract keys dynamically
        const keys = Object.keys(milkList[0]);

        // Calculate total amount
        const totalAmount = milkList.reduce(
            (sum, item) => sum + (Number(item.amount) || 0),
            0
        );

        // Transform data with formatted headers
        const formattedData = milkList.map(item => {
            const row = {};
            keys.forEach(key => {
                row[formatHeader(key)] = item[key];
            });
            return row;
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Prepare TOTAL row
        const totalRow = {};
        const formattedAmountKey = formatHeader('amount');

        keys.forEach((key, index) => {
            const header = formatHeader(key);

            if (header === formattedAmountKey) {
                totalRow[header] = `₹ ${totalAmount.toFixed(2)}`;
            } else if (index === 0) {
                totalRow[header] = 'TOTAL';
            } else {
                totalRow[header] = '';
            }
        });

        // Append TOTAL row
        XLSX.utils.sheet_add_json(worksheet, [totalRow], {
            skipHeader: true,
            origin: -1,
        });

        // Freeze header row
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

        // Auto column width
        worksheet['!cols'] = keys.map(() => ({ wch: 20 }));

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');

        // Generate Excel file
        const excelData = XLSX.write(workbook, {
            type: 'base64',
            bookType: 'xlsx',
        });

        const filePath =
            RNFS.DownloadDirectoryPath + `/Milk_Report_${Date.now()}.xlsx`;

        // Write file
        await RNFS.writeFile(filePath, excelData, 'base64');

        // Success actions
        Alert.alert(
            'Export Successful',
            'Excel file saved in Downloads folder',
            [
                { text: 'OK' },
                {
                    text: 'Open Folder',
                    onPress: () =>
                        Linking.openURL(
                            'content://com.android.externalstorage.documents/document/primary:Download'
                        ),
                },
                {
                    text: 'Share',
                    onPress: () =>
                        Share.open({
                            url: `file://${filePath}`,
                            type:
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            filename: 'Milk_Report',
                        }),
                },
            ]
        );
    } catch (error) {
        console.error('Excel export error:', error);
        Alert.alert('Export Failed', 'Something went wrong while exporting');
    }
};
