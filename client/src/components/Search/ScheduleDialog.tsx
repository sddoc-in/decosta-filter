import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'
import InputDate from '../input/InputDate';
import InputTime from '../input/InputTime';
import Recurrence from '../../constants/Recurrence';
import InputSelect from '../input/InputSelect';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<any>>;
    date: string;
    time: string;
    recurrence: string;
    onMethod: () => void;
}

export default function ScheduleDialog(props: Props) {

    const onClose = () => {
        props.setOpen({ ...props, open: false });
    }

    const handlleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setOpen({ ...props, [e.target.name]: e.target.value });
    }

    const handlleChangeSelect = (type: string, value: string) => {
        props.setOpen({ ...props, [type]: value });
    }

    return (
        <>
            <Modal isOpen={props.open} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <InputDate
                            name='date'
                            defValue={props.date}
                            label='Date'
                            onChangeHandler={handlleChange}
                        />

                        <InputTime
                            name='time'
                            defValue={props.time}
                            label='Time'
                            onChangeHandler={handlleChange}
                        />

                        <InputSelect
                            name='recurrence'
                            defaultValue={props.recurrence}
                            label='Recurrence'
                            selectArray={
                                Object.keys(Recurrence).map((key) => {
                                    return { value: key, name: Recurrence[key as keyof typeof Recurrence] }
                                })
                            }
                            handleChange={handlleChangeSelect}
                        />

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost' onClick={props.onMethod}
                        >Schedule</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
