import React from 'react'
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
  CloseIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text
} from '@gluestack-ui/themed'

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  isDisabled = false,
  ...props
}) => (
  <FormControl isInvalid={!!error} isDisabled={isDisabled} {...props}>
    {label ? (
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
    ) : null}
    <Input>
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </Input>
    {helper && !error ? (
      <FormControlHelper>
        <FormControlHelperText>{helper}</FormControlHelperText>
      </FormControlHelper>
    ) : null}
    {error ? (
      <FormControlError>
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    ) : null}
  </FormControl>
)

export const ModalForm = ({ isOpen, onClose, title, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalBackdrop />
    <ModalContent>
      <ModalHeader>
        <Heading size="sm">{title}</Heading>
        <ModalCloseButton>
          <CloseIcon />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </Modal>
)

export const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false
}) => (
  <AlertDialog isOpen={isOpen} onClose={onClose}>
    <AlertDialogBackdrop />
    <AlertDialogContent>
      <AlertDialogHeader>
        <Heading size="md">{title}</Heading>
      </AlertDialogHeader>
      <AlertDialogBody>
        {message ? <Text size="sm">{message}</Text> : null}
      </AlertDialogBody>
      <AlertDialogFooter>
        <HStack space="md">
          <Button size="sm" variant="outline" action="secondary" onPress={onClose}>
            <ButtonText>{cancelText}</ButtonText>
          </Button>
          <Button
            size="sm"
            action={destructive ? 'negative' : 'primary'}
            onPress={() => {
              onConfirm && onConfirm()
              onClose && onClose()
            }}
          >
            <ButtonText>{confirmText}</ButtonText>
          </Button>
        </HStack>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
