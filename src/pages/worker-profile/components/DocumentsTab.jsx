import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentsTab = ({ documents, onUpload, onDelete }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e?.target?.files?.[0];
      if (file) {
        setUploading(true);
        setTimeout(() => {
          onUpload({
            id: Date.now(),
            name: file?.name,
            type: type,
            size: (file?.size / 1024)?.toFixed(2) + ' KB',
            uploadDate: new Date()?.toLocaleDateString(),
            status: 'verified',
          });
          setUploading(false);
        }, 1500);
      }
    };
    input?.click();
  };

  const getDocumentIcon = (type) => {
    const icons = {
      resume: 'FileText',
      certification: 'Award',
      license: 'ShieldCheck',
      background: 'FileCheck',
    };
    return icons?.[type] || 'File';
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: 'badge-success',
      pending: 'badge-warning',
      expired: 'badge-error',
    };
    return badges?.[status] || 'badge-primary';
  };

  const documentTypes = [
    {
      type: 'resume',
      label: 'Resume/CV',
      description: 'Upload your latest resume or curriculum vitae',
      icon: 'FileText',
    },
    {
      type: 'certification',
      label: 'Certifications',
      description: 'Add professional certifications and training documents',
      icon: 'Award',
    },
    {
      type: 'license',
      label: 'Licenses',
      description: 'Upload required professional licenses',
      icon: 'ShieldCheck',
    },
    {
      type: 'background',
      label: 'Background Check',
      description: 'Background verification documents',
      icon: 'FileCheck',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes?.map((docType) => (
          <div key={docType?.type} className="card p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name={docType?.icon}
                  size={24}
                  color="var(--color-primary)"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{docType?.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {docType?.description}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              fullWidth
              iconName="Upload"
              iconPosition="left"
              onClick={() => handleFileUpload(docType?.type)}
              loading={uploading}
            >
              Upload
            </Button>
          </div>
        ))}
      </div>
      {documents?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents?.map((doc) => (
              <div
                key={doc?.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon
                      name={getDocumentIcon(doc?.type)}
                      size={20}
                      color="var(--color-primary)"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{doc?.name}</p>
                      <span className={`badge ${getStatusBadge(doc?.status)}`}>
                        {doc?.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {doc?.size} • Uploaded on {doc?.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Icon name="Download" size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(doc?.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Icon
                      name="Trash2"
                      size={18}
                      color="var(--color-destructive)"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {documents?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p>No documents uploaded yet. Upload your first document to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;