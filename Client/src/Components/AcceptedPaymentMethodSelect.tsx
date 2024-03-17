import {
    ListItemText,
    MenuItem,
    Checkbox,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { PaymentMethod } from '../types/types'

type AcceptedPaymentMethodSelectProps = {
    acceptedPaymentMethods: PaymentMethod[]
    handlePaymentMethodChange: (
        event: SelectChangeEvent<PaymentMethod[]>
    ) => void
    paymentMethods: Array<PaymentMethod>
}

const AcceptedPaymentMethodSelect = ({
    acceptedPaymentMethods,
    handlePaymentMethodChange,
    paymentMethods,
}: AcceptedPaymentMethodSelectProps) => {
    return (
        <FormControl>
            <InputLabel
                shrink={true}
                id="acceptedPaymentMethods"
                sx={{ backgroundColor: 'white', padding: '0 5px' }}
            >
                Accepted payment methods
            </InputLabel>
            <Select
                id="acceptedPaymentMethods"
                multiple
                MenuProps={{ disableScrollLock: true }}
                value={acceptedPaymentMethods}
                onChange={handlePaymentMethodChange}
                renderValue={(selected) => selected.join(', ')}
            >
                {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                        <Checkbox
                            checked={
                                acceptedPaymentMethods.indexOf(method) > -1
                            }
                        />
                        <ListItemText primary={method} />
                    </MenuItem>
                ))}
            </Select>
            {acceptedPaymentMethods.length === 0 && (
                <p className="select-placeholder">
                    Choose accepted payment methods...
                </p>
            )}
        </FormControl>
    )
}

export default AcceptedPaymentMethodSelect
