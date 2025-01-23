import React, { FC, memo, useState, useCallback } from "react";
import { Column } from "../../../components/column";
import { Spacing } from "../../../components/spacing";
import { Text } from "../../../components/text";
import { theme } from "../../../themes/theme";
import { Button, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useAppDispatch } from "../../../hooks/use-typed-selector";
import { banUser, unBanUser } from "../../../store/reducers/all/profile-slice";
import { UserInfo } from "../../../store/reducers/all/user-slice";
import Header from "../../../components/header/Header";

export type UserAdminPageViewProps = {
  user: UserInfo;
  banMessage: string;
  refreshUser: () => void;
};

export const UserAdminPageView: FC<UserAdminPageViewProps> = memo(({ user, banMessage, refreshUser }) => {
  const [banMessages, setBanMessage] = useState(banMessage);
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReason, setSelectedReason] = useState("");
  const reasons = ["Нарушение правил", "Спам", "Оскорбительное поведение", "Другое"];

  const handleBlockToggle = useCallback(() => {
    if (user.isBanned) {
      dispatch(unBanUser(user._id)).then(() => refreshUser());
    } else {
      onOpen();
    }
  }, [dispatch, user._id, user.isBanned, refreshUser, onOpen]);

  const handleBlockUser = useCallback(() => {
    if (selectedReason) {
      dispatch(banUser(user._id, selectedReason)).then(() => {
        onClose();
        setSelectedReason("");
        refreshUser();
        setBanMessage(selectedReason);
      });
    } else {
      alert("Пожалуйста, выберите причину блокировки.");
    }
  }, [dispatch, user._id, selectedReason, refreshUser, onClose]);

  return (
    <>
          <Header />
      {user.isBanned ? (
        <Column style={{ justifyContent: "center", alignItems: "center", paddingTop: "10%"}}>
          <Image
            src={user.mainPhoto || "https://via.placeholder.com/150"}
            alt={user.firstName}
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
          <Column horizontalAlign="center" style={{ marginLeft: "20px", textAlign: "center" }}>
            <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
            <Text themeFont={theme.fonts.m1}>Age: {user.age}</Text>
            <Text themeFont={theme.fonts.m1}>Purpose: {user.purpose[0]}</Text>
            <Text themeFont={theme.fonts.m1}>Location: {user.location}</Text>
            <Text themeFont={theme.fonts.m1}>Description: {user.description}</Text>
          </Column>
          <Spacing themeSpace={20} variant={"Column"} />
          <Text themeFont={theme.fonts.m1}>Пользователь заблокирован по причине:</Text>
          <Spacing themeSpace={10} variant={"Column"} />
          <Text themeFont={theme.fonts.m1}>{banMessages}</Text>
          <Spacing themeSpace={20} variant={"Column"} />
          <Button color="success" onPress={handleBlockToggle}>
            Разблокировать
          </Button>
        </Column>
      ) : (
        <Column style={{ justifyContent: "center", alignItems: "center", paddingTop: "10%" }}>
          <Image
            src={user.mainPhoto || "https://via.placeholder.com/150"}
            alt={user.firstName}
            width={170}
            height={170}
            style={{ borderRadius: "50%" }}
          />
          <Column horizontalAlign="center" style={{ textAlign: "center" }}>
            <Text themeFont={theme.fonts.m1}>Name: {user.firstName}</Text>
            <Text themeFont={theme.fonts.m1}>Age: {user.age}</Text>
            <Text themeFont={theme.fonts.m1}>Purpose: {user.purpose[0]}</Text>
            <Text themeFont={theme.fonts.m1}>Location: {user.location}</Text>
            <Text themeFont={theme.fonts.m1}>Description: {user.description}</Text>
          </Column>
          <Spacing themeSpace={20} variant={"Column"} />
          <Button color="danger" onPress={handleBlockToggle}>
            Заблокировать
          </Button>
        </Column>
      )}

      <Modal isOpen={isOpen} size="sm" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Выберите причину блокировки</ModalHeader>
              <ModalBody>
                {reasons.map((reason) => (
                  <label key={reason} style={{ display: "block", marginBottom: "10px" }}>
                    <input
                      type="radio"
                      name="banReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                    />
                    {reason}
                  </label>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleBlockUser} disabled={!selectedReason}>
                  Подтвердить блокировку
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
