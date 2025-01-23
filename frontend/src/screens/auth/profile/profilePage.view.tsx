import { FC, memo, useState, useEffect, ChangeEvent } from 'react';
import { Column } from '../../../components/column';
import { Spacing } from '../../../components/spacing';
import { Text } from '../../../components/text';
import { theme } from '../../../themes/theme';
import { Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Carousel from '../../../components/carousel/carousel';
import { Input } from '../../../components/input/input';
import Header from '../../../components/header/Header';
import Select from 'react-select';
import { userApi } from '../../../api/user/usersMethod';
import { UserInfo } from '../../../store/reducers/all/profile-slice';

const purposeOptions = [
  { value: 'networking', label: 'Networking' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'dating', label: 'Dating' },
  { value: 'business', label: 'Business' },
];

export type ProfilePageViewProps = {
  user: UserInfo;
  error: string | null;
  updateProfileUsers: (tempUser: any) => void;
  onFirstNameChange: (newFirstName: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onAgeChange: (newAge: number) => void;
  onLocationChange: (newLocation: string) => void;
  onPurposeChange: (newPurpose: string[]) => void;
  onMainPhotoChange: (newMainPhoto: string) => void;
  onPhotosChange: (newPhotos: string[]) => void;
  onDeleteProfile: () => void;
};

export const ProfilePageView: FC<ProfilePageViewProps> = memo(
  ({
    user,
    error,
    updateProfileUsers,
    onFirstNameChange,
    onDescriptionChange,
    onAgeChange,
    onLocationChange,
    onPurposeChange,
    onMainPhotoChange,
    onPhotosChange,
    onDeleteProfile,
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Using the useDisclosure hook to manage modal state
    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState<UserInfo>(user);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for the modal visibility

    useEffect(() => {
      setTempUser(user);
    }, [user]);

    const handleEditClick = () => {
      setIsEditing(true);
      setTempUser(user);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setTempUser(user);
      setPhotoError(null);
    };

    const handleSaveChanges = () => {
      if (!tempUser.mainPhoto) {
        setPhotoError('Main photo is required.');
        return;
      }

      const { firstName, description, age, location, purpose, mainPhoto, photos } = tempUser;
      onFirstNameChange(firstName);
      onDescriptionChange(description);
      onAgeChange(age);
      onLocationChange(location);
      onPurposeChange(purpose);
      onMainPhotoChange(mainPhoto);
      updateProfileUsers(tempUser);
      onPhotosChange(photos);
      setIsEditing(false);
    };

    const handleInputChange = (field: keyof UserInfo, value: string | number) => {
      setTempUser((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };

    const handleMainPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const uploadedUrl = await userApi.uploadFile(file);
          setTempUser((prevState) => ({ ...prevState, mainPhoto: uploadedUrl }));
          setPhotoError(null);
        } catch (error) {
          console.error('Error uploading main photo:', error);
        }
      }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        try {
          const uploadedUrls: string[] = [];
          for (const file of Array.from(files)) {
            const uploadedUrl = await userApi.uploadFile(file);
            uploadedUrls.push(uploadedUrl);
          }
          setTempUser((prevState) => ({
            ...prevState,
            photos: [...prevState.photos, ...uploadedUrls],
          }));
        } catch (error) {
          console.error('Error uploading files', error);
        }
      }
    };

    const handlePhotoDelete = (photoUrl: string) => {
      setTempUser((prevState) => ({
        ...prevState,
        photos: prevState.photos.filter((photo) => photo !== photoUrl),
      }));
    };

    const handlePurposeChange = (selectedOptions: any) => {
      const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
      setTempUser((prevState) => ({
        ...prevState,
        purpose: selectedValues,
      }));
    };

    // Handle confirming profile deletion
    const handleDeleteProfile = () => {
      onDeleteProfile();
      setIsModalVisible(false);
    };

    return (
      <>
        <Header />
        <Column style={{ height: '100%', paddingLeft: '20%', paddingRight: '20%', paddingTop: "60px" }} verticalAlign="center" horizontalAlign="center">
          <Spacing variant="Column" themeSpace={20} />

          <Column style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={tempUser.mainPhoto || 'https://via.placeholder.com/150'}
              alt={`${tempUser.firstName}`}
              width={170}
              height={170}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '30px',
                display: isEditing ? 'none' : 'block', // Hide when editing
              }}
            />
            <Column style={{ width: '60%' }}>
            
              {isEditing ? (
                <>
                  <EditableField label="Name" value={tempUser.firstName} onChange={(value) => handleInputChange('firstName', value)} />
                  <EditableField label="Age" value={tempUser.age.toString()} onChange={(value) => handleInputChange('age', Number(value))} />
                  <EditableField label="Location" value={tempUser.location} onChange={(value) => handleInputChange('location', value)} />
                  <EditableField label="Description" value={tempUser.description} onChange={(value) => handleInputChange('description', value)} />

                  <Column style={{ marginBottom: '20px' }}>
                    <Text themeFont={theme.fonts.m1}>Purpose:</Text>
                    <Select
                      isMulti
                      options={purposeOptions}
                      value={purposeOptions.filter((option) => tempUser.purpose.includes(option.value))}
                      onChange={handlePurposeChange}
                      placeholder="Select Purpose"
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      menuPortalTarget={document.body}
                    />
                  </Column>

                  <Column style={{ marginBottom: '20px' }}>
                    <Text themeFont={theme.fonts.m1}>Upload Main Photo:</Text>
                    {tempUser.mainPhoto ? (
                      <Image
                        src={tempUser.mainPhoto}
                        alt="Main Photo"
                        width={150}
                        height={150}
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <Text themeFont={theme.fonts.m1} style={{ color: 'red' }}>
                        Main photo not uploaded
                      </Text>
                    )}
                    <input type="file" accept="image/*" onChange={handleMainPhotoChange} />
                  </Column>

                  {/* Upload Additional Photos */}
                  <Column style={{ marginBottom: '20px' }}>
                    <Text themeFont={theme.fonts.m1}>Upload Additional Photos:</Text>
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                    <Column>
                      {tempUser.photos.map((photo) => (
                        <Column key={photo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                          <Image src={photo} alt="User Photo" width={100} height={100} style={{ marginRight: '10px' }} />
                          <Button onClick={() => handlePhotoDelete(photo)} color="danger">
                            Delete
                          </Button>
                        </Column>
                      ))}
                    </Column>
                  </Column>
                </>
              ) : (
                <>
                  <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
                  <Text themeFont={theme.fonts.m1}>Email: {user.email}</Text>
                  <Text themeFont={theme.fonts.m1}>Age: {user.age}</Text>
                  <Text themeFont={theme.fonts.m1}>Location: {user.location}</Text>
                  <Text themeFont={theme.fonts.m1}>Description: {user.description}</Text>
                  <Text themeFont={theme.fonts.m1}>
                    Purpose: {user.purpose && user.purpose.length > 0 ? user.purpose.join(', ') : 'No purpose available'}
                  </Text>
                </>
              )}
            </Column>
          </Column>

          <Spacing themeSpace={30} variant="Column" />

          {!isEditing ? (
            <Button onClick={handleEditClick} style={{ width: '180px', marginTop: '20px' }}>
              Edit Profile
            </Button>
          ) : (
            <Column style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%' }}>
              <Button onClick={handleSaveChanges} style={{ width: '180px' }}>
                Save Changes
              </Button>
              <Button onClick={handleCancelEdit} style={{ width: '180px' }}>
                Cancel Editing
              </Button>
            </Column>
          )}

          <Spacing themeSpace={40} variant="Column" />


          <Carousel data={user.photos} />
          
          <Spacing themeSpace={40} variant="Column" />
          <Button onClick={onOpen} color="danger" style={{ width: '180px' }}>
          Delete Profile
        </Button>
        </Column>

        {/* Modal for profile deletion */}
        <Modal isOpen={isOpen} size="sm" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Profile</ModalHeader>
              <ModalBody>
                <Text themeFont={theme.fonts.m1}>
                  Are you sure you want to delete your profile? This action is irreversible and your profile will be permanently deleted.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleDeleteProfile}>
                  Yes, Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      </>
    );
  }
);

const EditableField: FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <Column style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '15px' }}>
    <Text themeFont={theme.fonts.m1} style={{ width: '120px' }}>
      {label}:
    </Text>
    <Input value={value} setValue={onChange} />
  </Column>
);
