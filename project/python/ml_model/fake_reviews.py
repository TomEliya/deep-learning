from tkinter import N
import pandas as pd
import nltk
import re

from sklearn.preprocessing import StandardScaler  # for random forest and kernel svm
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import SVC  # 79.6%


class DetectFakeReviews:
    def __init__(self, csv: str) -> None:
        self.__csv = csv
        self.__fake = None
        self.__real = None
        nltk.download("stopwords")
        self.__prepare_data()
        self.__train_model()

    def __prepare_data(self):
        dataset = pd.read_csv(self.__csv, quoting=2)
        dataset = dataset.iloc[:, [2, 3]]  # electronics reviews

        # change the label to zero and one
        from sklearn.preprocessing import LabelEncoder

        le = LabelEncoder()
        first_review = dataset.iloc[0, 0]
        dataset.iloc[:, 0] = le.fit_transform(dataset.iloc[:, 0])
        if first_review == 'CG':
            self.__fake = dataset.iloc[0, 0]
        else:
            self.__real = dataset.iloc[0, 0]

        # print(dataset[-6: -1])
        # print(len(dataset))

        # Cleaning the texts
        from nltk.corpus import stopwords
        from nltk.stem.porter import PorterStemmer

        corpus = []
        for i in dataset.index:
            review = re.sub("[^a-zA-Z]", " ", dataset["text_"][i])
            review = review.lower()
            review = review.split()
            ps = PorterStemmer()
            all_stopwords = stopwords.words("english")
            all_stopwords.remove("not")
            review = [ps.stem(word) for word in review if not word in set(all_stopwords)]
            review = " ".join(review)
            corpus.append(review)

        # print(corpus)
        # print(len(corpus))
        self.__corpus = corpus
        self.__dataset = dataset

    def __train_model(self):
        # Creating the Bag of Words model
        self.__cv = CountVectorizer(max_features=1000)
        X = self.__cv.fit_transform(self.__corpus).toarray()
        y = self.__dataset.iloc[:, 0].values

        # Splitting the dataset into the Training set and Test set
        from sklearn.model_selection import train_test_split

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=0)

        # Feature Scaling
        self.__sc = StandardScaler()
        X_train = self.__sc.fit_transform(X_train)
        X_test = self.__sc.transform(X_test)

        # Training the Kernel SVM model on the Training set
        self.__classifier = SVC(kernel="rbf", random_state=0)
        self.__classifier.fit(X_train, y_train)

        # Predicting the Test set results
        y_pred = self.__classifier.predict(X_test)
        # print(np.concatenate((y_pred.reshape(len(y_pred), 1), y_test.reshape(len(y_test), 1)), 1))

        # Making the Confusion Matrix to get the score
        from sklearn.metrics import accuracy_score

        print("accuracy:", accuracy_score(y_test, y_pred))

        return self.__classifier, self.__cv, self.__sc

    def predict_value(self, to_predict: str) -> str:
        from nltk.corpus import stopwords
        from nltk.stem.porter import PorterStemmer

        to_predict = re.sub("[^a-zA-Z]", " ", to_predict)
        to_predict = to_predict.split()
        ps = PorterStemmer()
        all_stopwords = stopwords.words("english")
        all_stopwords.remove("not")
        to_predict = [ps.stem(word) for word in to_predict if not word in set(all_stopwords)]
        to_predict = " ".join(to_predict)
        to_predict = self.__cv.transform([to_predict]).toarray()
        our_real_review = self.__sc.transform(to_predict)

        post_prediction = self.__classifier.predict(our_real_review)
        if self.__real != None:
            return "Real" if post_prediction == self.__real else "Fake"
        else:
            return "Fake" if post_prediction == self.__fake else "Real"
            
