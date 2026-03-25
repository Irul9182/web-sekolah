import ProjectDetailIndex from '@/core-components/Project/detail';
import { ProyekProps } from '@/types/project.type';

interface PropTypes {
    proyek?: ProyekProps;
}

const ProjectDetailPage = ({ proyek }: PropTypes) => {
    return <ProjectDetailIndex proyek={proyek as ProyekProps} />;
};

export default ProjectDetailPage;
