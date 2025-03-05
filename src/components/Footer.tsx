import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
    return (
        <footer className="flex flex-row justify-center items-center gap-5 p-4 bg-gray-100 border-t border-gray-200">
            <p className="text-sm text-gray-600">
                Developed by <a href="https://github.com/pierod04" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Piero Delgado</a>
            </p>
            <a href="https://github.com/PieroD04/smart-scheduler" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                <GitHubIcon/>
            </a>
            
        </footer>
    );
}