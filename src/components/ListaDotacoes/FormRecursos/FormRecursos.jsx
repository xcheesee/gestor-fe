import { Box } from '@mui/material';
import CampoRecurso from '../CampoRecurso';

const FormRecursos = ({
    openFormRecurso,
    errors,
    formRecurso,
    //origemRecursos,
    enviaRecurso,
    editaRecurso,
}) => {

    return (
        <Box
            component="form"
            id="dotacao_form"
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                formData.append("dotacao_id", formRecurso.dotacao_id)
                openFormRecurso.acao === 'adicionar' ? enviaRecurso(formData) : editaRecurso(formRecurso.id, formData)
            }}>
                
            <CampoRecurso formRecurso={formRecurso} errors={errors} />
        </Box>
    );
}

export default FormRecursos;