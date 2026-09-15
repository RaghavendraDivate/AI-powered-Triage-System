import { CheckCircle, Clock, AlertTriangle, Zap } from "lucide-react";

const ConfidenceIndicator = ({ confidence, className = "" }) => {
  if (!confidence) return null;

  const getConfidenceConfig = (confidence) => {
    if (confidence >= 0.8) {
      return {
        level: 'high',
        text: 'High Confidence',
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: 'Very reliable analysis'
      };
    } else if (confidence >= 0.6) {
      return {
        level: 'moderate',
        text: 'Moderate Confidence',
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        description: 'Good analysis, may need follow-up'
      };
    } else if (confidence >= 0.3) {
      return {
        level: 'low',
        text: 'Low Confidence',
        icon: AlertTriangle,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        description: 'Preliminary analysis, more info needed'
      };
    } else {
      return {
        level: 'very-low',
        text: 'Very Low Confidence',
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: 'Limited analysis, recommend consultation'
      };
    }
  };

  const config = getConfidenceConfig(confidence);
  const IconComponent = config.icon;
  const percentage = Math.round(confidence * 100);

  return (
    <div className={`confidence-display-wrapper ${className}`}>
      <div className={`confidence-display ${config.bgColor} ${config.borderColor} border rounded-lg p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconComponent size={16} className={config.color} />
            <span className={`font-medium ${config.color}`}>
              {config.text}
            </span>
          </div>
          <div className={`confidence-percentage ${config.color} font-bold`}>
            {percentage}%
          </div>
        </div>
        
        <div className="confidence-bar bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`confidence-fill h-full rounded-full transition-all duration-500 ${
              config.level === 'high' ? 'bg-green-500' :
              config.level === 'moderate' ? 'bg-yellow-500' :
              config.level === 'low' ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-600 mt-1">{config.description}</p>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;