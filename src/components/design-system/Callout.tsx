interface CalloutProps {
    children: React.ReactNode;
    icon: string;
    title: string;
    tone: string;
}

export function Callout({ children, icon, title, tone }: CalloutProps) {
    return (
        <div className={`callout callout-${tone}`}>
            <span className="callout-icon">{icon}</span>
            <h3 className="callout-title">{title}</h3>
            <p className="callout-children">{children}</p>
        </div>
    );
}
export default Callout;