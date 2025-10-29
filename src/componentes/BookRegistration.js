import React, { useState } from 'react';
import '../estilos/BookRegistration.css';

const BookRegistration = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    año: '',
    tipo: ''
  });

  const [pdfFiles, setPdfFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePdfFilesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + pdfFiles.length > 5) {
      alert('Máximo 5 archivos PDF permitidos');
      return;
    }

    setPdfFiles(prev => [...prev, ...files]);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);
  };

  const removePdfFile = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.autor.trim()) newErrors.autor = 'El autor es obligatorio';
    if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria';
    if (!formData.año.trim()) newErrors.año = 'El año es obligatorio';
    if (!formData.tipo) newErrors.tipo = 'El tipo es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    pdfFiles.forEach(file => {
      submitData.append('pdfFiles', file);
    });

    if (coverImage) {
      submitData.append('coverImage', coverImage);
    }

    try {
      // Aquí iría la llamada a tu API del backend
      const response = await fetch('/api/books/register', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        alert('Libro registrado exitosamente');
        setFormData({
          titulo: '',
          autor: '',
          categoria: '',
          año: '',
          tipo: ''
        });
        setPdfFiles([]);
        setCoverImage(null);
      } else {
        throw new Error('Error al registrar el libro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar el libro. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="book-registration">
      <div className="registration-container">
        <h1>Registro de Libros</h1>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h2>Información Básica</h2>
            
            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={errors.titulo ? 'error' : ''}
                placeholder="Ingrese el título del libro"
              />
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="autor">Autor *</label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleInputChange}
                className={errors.autor ? 'error' : ''}
                placeholder="Ingrese el nombre del autor"
              />
              {errors.autor && <span className="error-message">{errors.autor}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoría *</label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={errors.categoria ? 'error' : ''}
                  placeholder="Ej: Ciencia Ficción, Historia, etc."
                />
                {errors.categoria && <span className="error-message">{errors.categoria}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="año">Año de Publicación *</label>
                <input
                  type="text"
                  id="año"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className={errors.año ? 'error' : ''}
                  placeholder="Ej: 2024"
                />
                {errors.año && <span className="error-message">{errors.año}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipo"
                    value="fisico"
                    checked={formData.tipo === 'fisico'}
                    onChange={handleInputChange}
                  />
                  <span>Físico</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipo"
                    value="digital"
                    checked={formData.tipo === 'digital'}
                    onChange={handleInputChange}
                  />
                  <span>Digital</span>
                </label>
              </div>
              {errors.tipo && <span className="error-message">{errors.tipo}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Archivos PDF (Máx. 5 archivos)</h2>
            <div className="form-group">
              <input
                type="file"
                id="pdfFiles"
                multiple
                accept=".pdf"
                onChange={handlePdfFilesChange}
                className="file-input"
              />
              <label htmlFor="pdfFiles" className="file-label">
                Seleccionar archivos PDF
              </label>
              
              {pdfFiles.length > 0 && (
                <div className="file-list">
                  <h4>Archivos seleccionados:</h4>
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removePdfFile(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Imagen de Portada</h2>
            <div className="form-group">
              <input
                type="file"
                id="coverImage"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleCoverImageChange}
                className="file-input"
              />
              <label htmlFor="coverImage" className="file-label">
                Seleccionar imagen de portada
              </label>
              
              {coverImage && (
                <div className="cover-preview">
                  <h4>Vista previa:</h4>
                  <div className="image-preview">
                    <img src={URL.createObjectURL(coverImage)} alt="Vista previa" />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Registrar Libro
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRegistration;