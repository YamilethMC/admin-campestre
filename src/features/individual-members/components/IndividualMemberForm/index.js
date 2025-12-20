import React, { useState, useEffect, useContext } from 'react';
import { useIndividualMember } from '../../hooks/useIndividualMember';
import { AppContext } from '../../../../shared/context/AppContext';
import { memberService } from '../../services';
import MultiStepForm from './MultiStepForm';

const IndividualMemberForm = ({ onCancel, loadMembers, initialData = null, memberId = null, isDependent = false }) => {
  const { formData, genderOptions, loadingGender, tituloOptions, loadingTitulo, paymentMethodOptions, loadingPaymentMethod, handleChange, handleSubmit, setFormData } = useIndividualMember();
  const { addToast } = useContext(AppContext);
  const [isLoadingMember, setIsLoadingMember] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (initialData) {
        const formattedData = {
          code_socio: initialData.memberCode || '',
          nombre: initialData.user?.name || '',
          apellidos: initialData.user?.lastName || '',
          sexo: initialData.user?.gender || '',
          rfc: initialData.user?.RFC || '',
          fecha_nacimiento: initialData.user?.birthDate ? new Date(initialData.user.birthDate).toISOString().split('T')[0] : '',
          email: initialData.user?.email || '',
          telefono_movil: initialData.user?.phone?.find(p => p.type === 'MOVIL')?.number || '',
          alias_movil: initialData.user?.phone?.find(p => p.type === 'MOVIL')?.alias || '',
          telefono_fijo: initialData.user?.phone?.find(p => p.type === 'PHONE')?.number || '',
          alias_fijo: initialData.user?.phone?.find(p => p.type === 'PHONE')?.alias || '',
          telefono_emergencia: initialData.user?.phone?.find(p => p.type === 'EMERGENCY')?.number || '',
          alias_emergencia: initialData.user?.phone?.find(p => p.type === 'EMERGENCY')?.alias || '',
          foraneo: initialData.user?.foraneo || false,
          calle: initialData.user?.address?.street || '',
          numero_exterior: initialData.user?.address?.externalNumber || '',
          numero_interior: initialData.user?.address?.internalNumber || '',
          codigo_postal: initialData.user?.address?.zipCode || '',
          colonia: initialData.user?.address?.suburb || '',
          ciudad: initialData.user?.address?.city || '',
          estado: initialData.user?.address?.state || '',
          pais: initialData.user?.address?.country || '',
          titulo: initialData.title || '',
          profesion: initialData.profession || '',
          metodo_pago: initialData.paymentMethod || '',
          fecha_admision: initialData.dateOfAdmission ? new Date(initialData.dateOfAdmission).toISOString().split('T')[0] : '',
          relationship: initialData.relationship || '',
        };
        setFormData(formattedData);
        setIsEditing(true);
        setEditingMemberId(initialData.id);
      } else if (!initialData && memberId && !isDependent) {
        try {
          setIsLoadingMember(true);
          const result = await memberService.getMemberById(memberId);

          if (result.success) {
            const memberData = result.data;
            const formattedData = {
              code_socio: memberData.memberCode || '',
              nombre: memberData.user?.name || '',
              apellidos: memberData.user?.lastName || '',
              sexo: memberData.user?.gender || '',
              rfc: memberData.user?.RFC || '',
              fecha_nacimiento: memberData.user?.birthDate ? new Date(memberData.user.birthDate).toISOString().split('T')[0] : '',
              email: memberData.user?.email || '',
              telefono_movil: memberData.user?.phone?.find(p => p.type === 'MOVIL')?.number || '',
              alias_movil: memberData.user?.phone?.find(p => p.type === 'MOVIL')?.alias || '',
              telefono_fijo: memberData.user?.phone?.find(p => p.type === 'PHONE')?.number || '',
              alias_fijo: memberData.user?.phone?.find(p => p.type === 'PHONE')?.alias || '',
              telefono_emergencia: memberData.user?.phone?.find(p => p.type === 'EMERGENCY')?.number || '',
              alias_emergencia: memberData.user?.phone?.find(p => p.type === 'EMERGENCY')?.alias || '',
              foraneo: memberData.user?.foraneo || false,
              calle: memberData.user?.address?.street || '',
              numero_exterior: memberData.user?.address?.externalNumber || '',
              numero_interior: memberData.user?.address?.internalNumber || '',
              codigo_postal: memberData.user?.address?.zipCode || '',
              colonia: memberData.user?.address?.suburb || '',
              ciudad: memberData.user?.address?.city || '',
              estado: memberData.user?.address?.state || '',
              pais: memberData.user?.address?.country || '',
              titulo: memberData.title || '',
              profesion: memberData.profession || '',
              metodo_pago: memberData.paymentMethod || '',
              fecha_admision: memberData.dateOfAdmission ? new Date(memberData.dateOfAdmission).toISOString().split('T')[0] : '',
              relationship: memberData.relationship || '',
            };
            setFormData(formattedData);
            setIsEditing(true);
            setEditingMemberId(memberData.id);
          } else {
            addToast(result.error || 'Error al obtener los datos del socio', 'error');
          }
        } catch (error) {
          console.error('Error fetching member data:', error);
          addToast('Error al obtener los datos del socio', 'error');
        } finally {
          setIsLoadingMember(false);
        }
      } else if (isDependent && !initialData) {
        const emptyData = {
          code_socio: '',
          nombre: '',
          apellidos: '',
          sexo: '',
          rfc: '',
          fecha_nacimiento: '',
          email: '',
          telefono_movil: '',
          alias_movil: '',
          telefono_fijo: '',
          alias_fijo: '',
          telefono_emergencia: '',
          alias_emergencia: '',
          foraneo: false,
          calle: '',
          numero_exterior: '',
          numero_interior: '',
          codigo_postal: '',
          colonia: '',
          ciudad: '',
          estado: '',
          pais: '',
          titulo: '',
          profesion: '',
          metodo_pago: '',
          fecha_admision: '',
          relationship: '',
        };
        setFormData(emptyData);
        setIsEditing(false);
      } else {
        setIsEditing(false);
      }
    };

    fetchMemberData();
  }, [initialData, memberId, isDependent, setFormData, addToast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    let submissionSuccess;
    if (isDependent && !isEditing) {
      submissionSuccess = await handleSubmit({ preventDefault: () => {} }, null, memberId, initialData, isDependent);
    } else if (isEditing) {
      submissionSuccess = await handleSubmit({ preventDefault: () => {} }, editingMemberId, null, initialData, isDependent);
    } else {
      submissionSuccess = await handleSubmit({ preventDefault: () => {} }, null, null, initialData, isDependent);
    }
    setShowSubmitModal(false);

    if (submissionSuccess && loadMembers) {
      loadMembers();
      setTimeout(() => {
        if (onCancel) {
          onCancel();
        }
      }, 100);
    }
  };

  return (
    <div>
      {isLoadingMember && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoadingMember && (
        <div className="space-y-6">
          <MultiStepForm
            formData={formData}
            handleChange={handleChange}
            handleFormSubmit={handleFormSubmit}
            genderOptions={genderOptions}
            loadingGender={loadingGender}
            tituloOptions={tituloOptions}
            loadingTitulo={loadingTitulo}
            paymentMethodOptions={paymentMethodOptions}
            loadingPaymentMethod={loadingPaymentMethod}
            isDependent={isDependent}
            isEditing={isEditing}
          />

          {showSubmitModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar registro</h3>
                <p className="text-gray-600 mb-4">
                  ¿Estás seguro que deseas registrar al socio? Verifica que todos los datos sean correctos.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                    onClick={handleConfirmSubmit}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualMemberForm;
