import { Form, FormInstance, ModalProps, Transfer } from 'antd';
import { LoadingMask, ModalForm } from 'app/components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { User } from 'app/slice/types';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_TIMES, SPACE_XS } from 'styles/StyleConstants';
import { selectMemberListLoading, selectMembers } from '../../slice/selectors';
import { getMembers } from '../../slice/thunks';

interface MemberFormProps extends ModalProps {
  initialValues: User[];
  onChange: (members: User[]) => void;
}

export const MemberForm = memo(
  ({ initialValues, onChange, onCancel, ...modalProps }: MemberFormProps) => {
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const dispatch = useDispatch();
    const formRef = useRef<FormInstance>();
    const members = useSelector(selectMembers);
    const memberListLoading = useSelector(selectMemberListLoading);
    const orgId = useSelector(selectOrgId);
    const dataSource = useMemo(
      () => members.map(m => ({ ...m, key: m.id })),
      [members],
    );

    useEffect(() => {
      if (modalProps.visible) {
        dispatch(getMembers(orgId));
      }
    }, [dispatch, orgId, modalProps.visible]);

    useEffect(() => {
      setTargetKeys(initialValues.map(({ id }) => id));
    }, [initialValues]);

    const save = useCallback(() => {
      onChange(targetKeys.map(id => members.find(m => m.id === id)!));
      onCancel && onCancel(null as any);
    }, [targetKeys, members, onCancel, onChange]);

    const renderTitle = useCallback(
      ({ name, username, email }) => (
        <ItemTitle>
          {name && <span>{name}</span>}
          {username && <span>{` (${username})`}</span>}
          {email && <span className="email">{email}</span>}
        </ItemTitle>
      ),
      [],
    );

    return (
      <ModalForm
        {...modalProps}
        onSave={save}
        onCancel={onCancel}
        ref={formRef}
      >
        <TransferWrapper>
          <LoadingMask loading={memberListLoading}>
            <Transfer
              dataSource={dataSource}
              targetKeys={targetKeys}
              render={renderTitle}
              onChange={setTargetKeys}
              showSearch
            />
          </LoadingMask>
        </TransferWrapper>
      </ModalForm>
    );
  },
);

const TransferWrapper = styled(Form.Item)`
  position: relative;

  .ant-transfer-list {
    flex: 1;
    height: ${SPACE_TIMES(100)};
  }
`;

const ItemTitle = styled.div`
  .email {
    margin-left: ${SPACE_XS};
    color: ${p => p.theme.textColorLight};
  }
`;
