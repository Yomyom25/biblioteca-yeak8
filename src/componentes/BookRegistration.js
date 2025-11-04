// src/pages/BookRegistration.js

import React, { useState } from 'react';
import '../estilos/BookRegistration.css';
import { useBookManagement } from '../hooks/useBookManagement';

const BookRegistration = () => {
  
  const { 
    registerBook, 
    isLoading, 
    error, 
    successMessage, 
    setError, 
    setSuccessMessage 
  } = useBookManagement();

  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    ano: '', // SIN TILDE
    tipo: 'fisico',
    ejemplares: '1'
  });

  const [pdfFiles, setPdfFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ejemplares: value === 'digital' ? '0' : '1'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setError(null);
    setSuccessMessage(null);
  };

  const handlePdfFilesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + pdfFiles.length > 5) {
      setErrors(prev => ({ ...prev, pdfFiles: 'Máximo 5 archivos PDF permitidos' }));
      return;
    }

    const invalidFiles = files.filter(f => f.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ ...prev, pdfFiles: 'Solo se permiten archivos PDF' }));
      return;
    }

    const oversizedFiles = files.filter(f => f.size > 2 * 1024 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, pdfFiles: 'Cada archivo PDF no debe exceder 2GB' }));
      return;
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0) + pdfFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 2 * 1024 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, pdfFiles: 'El tamaño total de los archivos PDF no debe exceder 2GB' }));
      return;
    }

    setErrors(prev => ({ ...prev, pdfFiles: '' }));
    setPdfFiles(prev => [...prev, ...files]);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, coverImage: 'Solo se permiten imágenes JPG, PNG o WEBP' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, coverImage: 'La imagen no debe exceder 5MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, coverImage: '' }));
    setCoverImage(file);
  };

  const removePdfFile = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => ({ ...prev, pdfFiles: '' }));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setErrors(prev => ({ ...prev, coverImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    else if (formData.titulo.trim().length < 2) newErrors.titulo = 'El título debe tener al menos 2 caracteres';
    else if (formData.titulo.trim().length > 150) newErrors.titulo = 'El título no debe exceder 150 caracteres';

    if (!formData.autor.trim()) newErrors.autor = 'El autor es obligatorio';
    else if (formData.autor.trim().length < 2) newErrors.autor = 'El autor debe tener al menos 2 caracteres';
    else if (formData.autor.trim().length > 100) newErrors.autor = 'El autor no debe exceder 100 caracteres';

    if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria';
    else if (formData.categoria.trim().length < 2) newErrors.categoria = 'La categoría debe tener al menos 2 caracteres';
    else if (formData.categoria.trim().length > 100) newErrors.categoria = 'La categoría no debe exceder 100 caracteres';

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.ano);
    if (!formData.ano.trim()) newErrors.ano = 'El año es obligatorio';
    else if (isNaN(year)) newErrors.ano = 'El año debe ser un número válido';
    else if (year < 1000) newErrors.ano = 'El año debe ser mayor a 1000';
    else if (year > currentYear) newErrors.ano = `El año no puede ser mayor al actual (${currentYear})`;

    if (!formData.tipo || !['fisico', 'digital'].includes(formData.tipo)) newErrors.tipo = 'Debe seleccionar un tipo válido';

    const ejemplares = parseInt(formData.ejemplares);
    if (formData.tipo === 'fisico') {
      if (isNaN(ejemplares) || ejemplares < 1) newErrors.ejemplares = 'Debe haber al menos 1 ejemplar físico';
      else if (ejemplares > 9999) newErrors.ejemplares = 'El número de ejemplares no puede exceder 9999';
    }

    if (formData.tipo === 'digital' && pdfFiles.length === 0) newErrors.pdfFiles = 'Los libros digitales requieren al menos un archivo PDF';
    if (!coverImage) newErrors.coverImage = 'La imagen de portada es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const submitData = new FormData();
    submitData.append('titulo', formData.titulo.trim());
    submitData.append('autor', formData.autor.trim());
    submitData.append('categoria', formData.categoria.trim());
    submitData.append('ano', formData.ano);
    submitData.append('tipo', formData.tipo);
    submitData.append('ejemplares', formData.tipo === 'digital' ? '0' : formData.ejemplares);

    pdfFiles.forEach(file => submitData.append('pdfFiles', file));
    if (coverImage) submitData.append('coverImage', coverImage);

    console.log('📋 Datos a enviar:');
    for (let pair of submitData.entries()) console.log(`${pair[0]}:`, pair[1]);

    const result = await registerBook(submitData);

    if (result.success) {
      setFormData({ titulo:'', autor:'', categoria:'', ano:'', tipo:'fisico', ejemplares:'1' });
      setPdfFiles([]);
      setCoverImage(null);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="book-registration">
      <div className="registration-container">
        <h1>Registro de Libros</h1>

        {error && <div className="message-box error">❌ Error: {error}</div>}
        {successMessage && <div className="message-box success">✅ {successMessage}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* INFORMACIÓN BÁSICA */}
          <div className="form-section">
            <h2>Información Básica</h2>
            <div className="form-group">
              <label htmlFor="titulo">Título <span className="required">*</span></label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={errors.titulo ? 'error' : ''}
                placeholder="Ingrese el título del libro"
                maxLength="150"
              />
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="autor">Autor <span className="required">*</span></label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleInputChange}
                className={errors.autor ? 'error' : ''}
                placeholder="Ingrese el nombre del autor"
                maxLength="100"
              />
              {errors.autor && <span className="error-message">{errors.autor}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoría <span className="required">*</span></label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={errors.categoria ? 'error' : ''}
                  placeholder="Ej: Ciencia Ficción, Historia"
                  maxLength="100"
                />
                {errors.categoria && <span className="error-message">{errors.categoria}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ano">Año de Publicación <span className="required">*</span></label>
                <input
                  type="number"
                  id="ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  className={errors.ano ? 'error' : ''}
                  placeholder={`Ej: ${new Date().getFullYear()}`}
                  min="1000"
                  max={new Date().getFullYear()}
                />
                {errors.ano && <span className="error-message">{errors.ano}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo <span className="required">*</span></label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="tipo" value="fisico" checked={formData.tipo==='fisico'} onChange={handleInputChange} />
                    <span>Físico</span>
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="tipo" value="digital" checked={formData.tipo==='digital'} onChange={handleInputChange} />
                    <span>Digital</span>
                  </label>
                </div>
                {errors.tipo && <span className="error-message">{errors.tipo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ejemplares">Ejemplares Físicos <span className="required">*</span></label>
                <input
                  type="number"
                  id="ejemplares"
                  name="ejemplares"
                  min="0"
                  max="9999"
                  value={formData.ejemplares}
                  onChange={handleInputChange}
                  className={errors.ejemplares ? 'error' : ''}
                  placeholder="Cantidad"
                  disabled={formData.tipo === 'digital'}
                />
                {errors.ejemplares && <span className="error-message">{errors.ejemplares}</span>}
                {formData.tipo === 'digital' && (
                  <span className="info-message">Los libros digitales no tienen ejemplares físicos</span>
                )}
              </div>
            </div>
          </div>

          {/* ARCHIVOS PDF */}
          <div className="form-section">
            <h2>Archivos PDF (Máx. 5 archivos){formData.tipo==='digital' && <span className="required"> *</span>}</h2>
            <div className="form-group">
              <input type="file" id="pdfFiles" multiple accept=".pdf" onChange={handlePdfFilesChange} className="file-input" />
              <label htmlFor="pdfFiles" className="file-label">Seleccionar archivos PDF</label>
              {errors.pdfFiles && <span className="error-message">{errors.pdfFiles}</span>}

              {pdfFiles.length > 0 && (
                <div className="file-list">
                  <h4>Archivos seleccionados ({pdfFiles.length}/5):</h4>
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>📄 {file.name} <small>({(file.size/1024/1024).toFixed(2)} MB)</small></span>
                      <button type="button" onClick={() => removePdfFile(index)} className="remove-btn" title="Eliminar archivo">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* IMAGEN DE PORTADA */}
          <div className="form-section">
            <h2>Imagen de Portada <span className="required">*</span></h2>
            <div className="form-group">
              <input type="file" id="coverImage" accept=".png,.jpg,.jpeg,.webp" onChange={handleCoverImageChange} className="file-input" />
              <label htmlFor="coverImage" className="file-label">Seleccionar imagen de portada</label>
              {errors.coverImage && <span className="error-message">{errors.coverImage}</span>}

              {coverImage && (
                <div className="cover-preview">
                  <h4>Vista previa:</h4>
                  <div className="image-preview">
                    <img src={URL.createObjectURL(coverImage)} alt="Vista previa de portada" />
                    <button type="button" onClick={removeCoverImage} className="remove-btn" title="Eliminar imagen">×</button>
                  </div>
                  <small>{coverImage.name} ({(coverImage.size/1024/1024).toFixed(2)} MB)</small>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Libro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRegistration;
