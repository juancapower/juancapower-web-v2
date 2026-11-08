export function complaintReceipt(number, created, provider, payload) {
  const fields = [
    ['Tipo', payload.kind], ['Nombre', payload.name], ['Tipo de documento', payload.documentType],
    ['Documento', payload.documentNumber], ['Domicilio', payload.address], ['Correo', payload.email],
    ['Teléfono', payload.phone], ['Menor de edad', payload.minor ? 'Sí' : 'No'],
    ['Representante', payload.guardian], ['Servicio', payload.service], ['Monto reclamado (S/)', payload.amount],
    ['Detalle', payload.detail], ['Pedido', payload.request],
  ];
  const lima = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima', dateStyle: 'long', timeStyle: 'medium',
  }).format(new Date(created));
  return [
    `Hoja de Reclamación ${number}`, provider.name, `RUC ${provider.ruc}`, provider.address,
    `Fecha y hora de presentación: ${lima} (hora de Lima)`,
    ...fields.filter(([, value]) => value !== '').map(([label, value]) => `${label}: ${value}`),
    'Acciones u observaciones del proveedor: por completar durante la atención.',
    'Respuesta en un máximo de 15 días hábiles improrrogables. La presentación no limita otras vías de solución.',
  ].join('\n');
}
