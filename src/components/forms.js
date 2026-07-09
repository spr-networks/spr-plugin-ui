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
      <FormControlLabel mb="$1.5">
        <FormControlLabelText fontWeight="$semibold" color="$textLight800" sx={{ _dark: { color: '$textDark100' } }}>
          {label}
        </FormControlLabelText>
      </FormControlLabel>
    ) : null}
    <Input
      size="md"
      borderRadius="$xl"
      borderColor="$muted300"
      bg="$backgroundCardLight"
      sx={{
        _dark: {
          bg: '$backgroundCardDark',
          borderColor: '$muted700'
        }
      }}
    >
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
      <FormControlHelper mt="$1.5">
        <FormControlHelperText>{helper}</FormControlHelperText>
      </FormControlHelper>
    ) : null}
    {error ? (
      <FormControlError mt="$1.5">
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    ) : null}
  </FormControl>
)

export const ModalForm = ({ isOpen, onClose, title, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalBackdrop />
    <ModalContent borderRadius="$2xl" borderColor="$borderColorCardLight" sx={{ _dark: { borderColor: '$borderColorCardDark' } }}>
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
    <AlertDialogContent borderRadius="$2xl" borderColor="$borderColorCardLight" sx={{ _dark: { borderColor: '$borderColorCardDark' } }}>
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
